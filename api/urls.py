from django.urls import path
from .views import AddFavorite, ExploreMovies, GetFavoriteMovies, GetNumPages, IsMovieLiked, LoginView, LogoutView, MovieDetails, MovieOverview, RemoveFavorite, SearchMovie, TrendingMoviesView, RegisterView, UserView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('trending_movies', TrendingMoviesView),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('movie/<int:movie_id>/', MovieDetails.as_view()),
    path('add_favorite', AddFavorite.as_view()),
    path('is_movie_liked/<int:movie_id>/', IsMovieLiked.as_view()),
    path('remove_favorite/<int:movie_id>/', RemoveFavorite.as_view()),
    path('favorites', GetFavoriteMovies.as_view()),
    path('movie_overview/<int:movie_id>/', MovieOverview.as_view()),
    path('explore/<int:page>', ExploreMovies.as_view()),
    path('explore/pages', GetNumPages.as_view()),
    path("search/<str:movie>", SearchMovie.as_view())
]