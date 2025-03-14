# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class GameProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="game_profile")
    total_games_played = models.IntegerField(default=0)
    total_wins = models.IntegerField(default=0)
    total_losses = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    def __str__(self):
        return f"{self.user.username}'s Game Profile"

# Game Model
class Game(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

# Match Model
class Match(models.Model):
    OPPONENT_TYPE_CHOICES = [
        ('user', 'User'),
        ('cpu', 'CPU'),
    ]

    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="matches")
    logged_in_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_matches")
    opponent_display_name = models.CharField(max_length=100)
    opponent_type = models.CharField(max_length=10, choices=OPPONENT_TYPE_CHOICES)
    date = models.DateField(auto_now_add=True)  # Automatically set the date when the match is created
    time = models.TimeField(auto_now_add=True)  # Automatically set the time when the match is created
    result = models.CharField(max_length=10, choices=[('win', 'Win'), ('loss', 'Loss'), ('draw', 'Draw')])
    user_score = models.IntegerField(default=0)
    opponent_score = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.logged_in_user.username} vs {self.opponent_display_name} - {self.result}"

class TournamentPlayer(models.Model):
    tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name='players')
    display_name = models.CharField(max_length=100)

    def __str__(self):
        return self.display_name


# Tournament Model
class Tournament(models.Model):
    game = models.ForeignKey('Game', on_delete=models.CASCADE, related_name='tournaments')
    logged_in_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournaments')
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    winner = models.ForeignKey(TournamentPlayer, on_delete=models.SET_NULL, null=True, blank=True, related_name='tournaments_won')

    def __str__(self):
        return f"{self.game.name} Tournament on {self.date}"


# TournamentMatch Model
class TournamentMatch(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    player1 = models.ForeignKey(TournamentPlayer, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(TournamentPlayer, on_delete=models.CASCADE, related_name='matches_as_player2')
    winner = models.ForeignKey(TournamentPlayer, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches_won')
    round_number = models.IntegerField(default=1)  # E.g., 1 for initial matches, 2 for finals

    def __str__(self):
        return f"Round {self.round_number}: {self.player1} vs {self.player2} ({self.tournament.game.name})"