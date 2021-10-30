from django.urls import path
from .views import MoviesView, TrendingMovies, UserView

urlpatterns = [
    path('home', UserView.as_view()),
    path('movies', MoviesView),
    path('trending_movies', TrendingMovies)
]