from rest_framework import serializers
from .models import GameProfile, Game, Match, Tournament, TournamentPlayer, TournamentMatch

class GameProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameProfile
        fields = ['total_games_played', 'total_wins', 'total_losses', 'total_score']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'

class MatchHistorySerializer(serializers.ModelSerializer):
    game_name = serializers.CharField(source='game.name')  # Add game name

    class Meta:
        model = Match
        fields = ['opponent_display_name', 'game_name', 'date', 'time', 'result']

class TournamentPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentPlayer
        fields = '__all__'

class TournamentMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentMatch
        fields = '__all__'
        