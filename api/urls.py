from django.urls import path
from .views import AddFavorite, IsMovieLiked, LoginView, LogoutView, MovieDetails, RemoveFavorite, TrendingMoviesView, RegisterView, UserView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('trending_movies', TrendingMoviesView),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('movie/<int:movie_id>/', MovieDetails.as_view()),
    path('add_favorite', AddFavorite.as_view()),
    path('is_movie_liked/<int:movie_id>/', IsMovieLiked.as_view()),
    path('remove_favorite/<int:movie_id>/', RemoveFavorite.as_view())
]