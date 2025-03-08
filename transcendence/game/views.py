from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.db.models import F, Value
from django.db.models.functions import Concat
from django.contrib.auth.models import User
from .models import Game, Match, Tournament, GameProfile, TournamentPlayer, TournamentMatch
from authentication.models import UserProfile
from authentication.views import get_avatar_url
from .serializers import (
    GameSerializer,
    MatchSerializer,
    MatchHistorySerializer,
    TournamentSerializer,
    GameProfileSerializer
)

class GameListView(APIView):
    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)

class MatchCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, gameName):

       # Fetch the game object based on gameName
        game = get_object_or_404(Game, name=gameName)

        # Add authenticated user's ID to the match data
        match_data = request.data.copy()
        match_data['game'] = game.id
        match_data['logged_in_user'] = request.user.id

        # Serialize and save the match data
        serializer = MatchSerializer(data=match_data)
        if serializer.is_valid():
            with transaction.atomic():
                match = serializer.save()  # Save the match and get the instance
                update_game_stats(match)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Handle validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def view_match_history(request):
    user = request.user

    matches = Match.objects.filter(logged_in_user=user).order_by('-date', '-time')
    serializer = MatchHistorySerializer(matches, many=True)

    return Response(serializer.data)

#Update Gameprofile after each match
def update_game_stats(match):
     # Use get_or_create to fetch or create a GameProfile for the user
    profile, created = GameProfile.objects.get_or_create(user=match.logged_in_user, defaults={
        'total_games_played': 0,
        'total_wins': 0,
        'total_losses': 0,
        'total_score': 0,
    })

    # Increment games played
    profile.total_games_played = F('total_games_played') + 1

    # Update wins, losses, or draws
    if match.result == 'win':
        profile.total_wins = F('total_wins') + 1
        profile.total_score = F('total_score') + match.user_score
    elif match.result == 'loss':
        profile.total_losses = F('total_losses') + 1

    profile.save()
    profile.refresh_from_db()
    # Debugging message to confirm the update
    print(f"Game stats updated for user: {match.logged_in_user}. Created: {created}")

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def view_stats(request):
    if not request.user.is_authenticated:
        return Response({'error': 'User is not authenticated'}, status=HTTP_401_UNAUTHORIZED)
    user = request.user
    try:
        # Get the GameProfile for the user
        stats = GameProfile.objects.get(user=user)
    except GameProfile.DoesNotExist:
        default_stats = {
            'user': user.id,
            'total_games_played': 0,
            'total_wins': 0,
            'total_losses': 0,
            'total_score': 0,
        }
        return Response(default_stats)

    # Serialize the GameProfile instance
    serializer = GameProfileSerializer(stats)
    # print("Profile found:", serializer.data) 
    return Response(serializer.data)

#Leaderboard
# Function to calculate the winning rate
def calculate_winning_rate(wins, losses):
    total_games = wins + losses
    return wins / total_games if total_games > 0 else 0

# Function to get the leaderboard data
def get_leaderboard(request):
    # Get all UserProfiles with their related User objects
    user_profiles = UserProfile.objects.select_related('user').all()

    leaderboard_data = []

    for user_profile in user_profiles:
        user = user_profile.user
        # Fetch the related GameProfile for the user
        try:
            game_profile = GameProfile.objects.get(user=user)
            winning_rate = calculate_winning_rate(game_profile.total_wins, game_profile.total_losses)
            leaderboard_data.append({
            'rank': None, 
            'avatar':get_avatar_url(user, request),
            'display_name': user_profile.display_name,
            'total_score': game_profile.total_score,
            'winning_rate': winning_rate,
            'date_joined': user_profile.user.date_joined,
            })

        except GameProfile.DoesNotExist:
            # Handle users without a GameProfile
            leaderboard_data.append({
                'rank': None,
                'avatar':'images/avatar.png',
                'display_name': user_profile.display_name,
                'total_score': 0,  # Default score for users without a GameProfile
                'winning_rate': 0.0,  # Default winning rate
                'date_joined': user.date_joined,
            })


    # Sort the leaderboard based on total score (descending)
    leaderboard_data = sorted(leaderboard_data, key=lambda x: x['total_score'], reverse=True)

    # Add rank to each player based on their position in the sorted list
    for index, player in enumerate(leaderboard_data):
        player['rank'] = index + 1  # Rank starts from 1

    return leaderboard_data

# View to return the leaderboard in a JSON response

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def leaderboard_view(request):
    leaderboard_data = get_leaderboard(request)
    return Response(leaderboard_data)

#TOURNAMENT

class TournamentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, gameName):
        """
        Creates a tournament, adds players, and generates matches in a single API request.
        """
        # Fetch the game object based on gameName
        game = get_object_or_404(Game, name=gameName)

        # printing raw data
        # print(f"Raw request body: {request.body}")
        # print(f"Parsed request data: {request.data}")


        # Extract and validate request data
        tournament_data = request.data.copy()
        players_data = tournament_data.pop('players', [])  # Extract players list
        matches_data = tournament_data.pop('matches', [])  # Extract matches list
        winner_name = tournament_data.pop('winner_name', None) #tournament winner name
        
        tournament_data['game'] = game.id
        tournament_data['logged_in_user'] = request.user.id

        # Validate tournament data
        tournament_serializer = TournamentSerializer(data=tournament_data)
        if not tournament_serializer.is_valid():
            return Response(tournament_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Use a transaction to ensure atomicity
        with transaction.atomic():
            # Create Tournament
            tournament = tournament_serializer.save()

            # Add Players
            player_instances = []
            for display_name in players_data:
                player = TournamentPlayer.objects.create(tournament=tournament, display_name=display_name)
                player_instances.append(player)

            # Store player instances in a dictionary for quick lookup
            player_lookup = {player.display_name: player for player in player_instances}

            # Create Matches
            match_instances = []
            for match in matches_data:
                player1 = player_lookup.get(match.get('player1'))
                player2 = player_lookup.get(match.get('player2'))
                winner = player_lookup.get(match.get('winner'))
                round_number = match.get('round_number', 1)

                if not player1 or not player2:
                    return Response({"error": "Invalid player names provided in matches."}, status=status.HTTP_400_BAD_REQUEST)

                match_instance = TournamentMatch.objects.create(
                    tournament=tournament, player1=player1, player2=player2, winner=winner,round_number=round_number
                )
                match_instances.append(match_instance)

            # Assign tournament winner
            if winner_name and winner_name in player_lookup:
                tournament.winner = player_lookup[winner_name]
                tournament.save()

        # Return a success response with all created data
        return Response(
            {
                "message": "Tournament created successfully"},
                status=status.HTTP_201_CREATED
        )
    
# ----TOURNAMENT HISTORY VIEW----
@permission_classes([IsAuthenticated])
@api_view(['GET'])   
def tournament_list_view(request):
    """Returns all tournaments sorted by date and time in descending order."""
    tournaments = Tournament.objects.all().order_by('-date', '-time')
    tournament_data = []

    for tournament in tournaments:
        user_profile = tournament.logged_in_user.userprofile
        user_name = user_profile.display_name if user_profile else None
        winner = TournamentPlayer.objects.filter(id=tournament.winner_id).first()
        winner_name = winner.display_name if winner else None
        formatted_date = tournament.date.strftime('%d/%m')
        formatted_time = tournament.time.strftime('%H:%M')

        tournament_data.append(
            {
                'id': tournament.id,
                'logged_in_user': user_name,  # User who created the tournament
                'game_name': tournament.game.name,  # Assuming a ForeignKey to Game
                'date': formatted_date,
                'time': formatted_time,
                'winner': winner_name
            }
        )

    return Response(tournament_data)

@permission_classes([IsAuthenticated])
@api_view(['GET'])
def tournament_detail_view(request, tournament_id):
    """Fetches matches for a given tournament when the plus button is clicked."""
    tournament = get_object_or_404(Tournament, id=tournament_id)
    matches = TournamentMatch.objects.filter(tournament=tournament).order_by('round_number')

    match_data = []
    for match in matches:
        player1 = match.player1.display_name if match.player1 else None
        player2 = match.player2.display_name if match.player2 else None
        winner = match.winner.display_name if match.winner else None        
        match_data.append({
            'round_number': match.round_number,
            'player1': player1,
            'player2': player2,
            'winner': winner
        })

    return Response(match_data)

