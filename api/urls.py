from django.urls import path
from .views import AddFavorite, LoginView, LogoutView, MovieDetails, TrendingMoviesView, RegisterView, UserView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('trending_movies', TrendingMoviesView),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('movie/<int:movie_id>/', MovieDetails.as_view()),
    path('add_favorite', AddFavorite.as_view())
]