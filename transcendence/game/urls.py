from django.urls import path
from .views import MatchCreateView, view_match_history, view_stats, leaderboard_view, TournamentCreateView, tournament_list_view, tournament_detail_view

urlpatterns = [
    path('games/<str:gameName>/create-match/', MatchCreateView.as_view(), name='create-match'),
    path('games/matches/', view_match_history, name = 'view_match_history'),
    path('games/user-stats', view_stats, name = 'view_stats'),
    path('games/leaderboard', leaderboard_view, name = 'leaderboard'),
    path('games/<str:gameName>/tournament/', TournamentCreateView.as_view(), name = 'tournament'),
    path('games/tournamentlist', tournament_list_view, name = 'tournamentlist'),
    path('games/<int:tournament_id>/tournamentdetail', tournament_detail_view,name = 'tournamentdetail'),
]
