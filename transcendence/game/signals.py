from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Game

@receiver(post_migrate)
def add_default_games(sender, **kwargs):
    games = ["Pong", "Tic-Tac-Toe","Rock-Paper-Scissor"]
    for game_name in games:
        Game.objects.get_or_create(name=game_name)