from django.urls import path
from .views import TrendingMovies, Users

urlpatterns = [
    path('users', Users),
    path('trending_movies', TrendingMovies)
]