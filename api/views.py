from datetime import datetime as dtime
from django.http.response import Http404
import pip._vendor.requests as requests
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework.response import Response
from .serializers import FavoriteMoviesSerializer, UserSerializer
from .models import FavoriteMovies, User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
import jwt, datetime
import pandas as pd
from api.utils import getUsername

genres_gathered = {}

API_KEY = "aac569ce5b81de3e31bee34323e9745e"

movies_df = pd.read_csv("movie_dataset.csv")

# Create your views here.
class MovieDetails(APIView):
    def get(self, request, movie_id):
        resp = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&append_to_response=credits")
        resp.encoding = "utf-8"
        movie = {}
        if resp.ok:
            respJson = resp.json()
            movie["title"] = respJson["title"]
            movie["overview"] = respJson["overview"]
            movie["poster_path"] = respJson["poster_path"]
            movie["rating"] = respJson["vote_average"]
            movie["duration"] = respJson["runtime"]
            movie["genres"] = []
            for genre in respJson["genres"]:
                movie["genres"].append(genre["name"])
            movie["budget"] = respJson["budget"]
            movie["revenue"] = respJson["revenue"]
            movie["production_companies"] = respJson["production_companies"][:3]
            movie["release_date"] = respJson["release_date"]
            movie["directors"] = list(filter(lambda crew_member: crew_member['job'] == 'Director', respJson["credits"]["crew"]))[:3]
            movie["writers"] = []
            list_writers = list(filter(lambda crew_member: crew_member['job'] == 'Screenplay', respJson["credits"]["crew"]))[:3]
            if len(list_writers)!=0:
                if(len(movie["writers"])!=0):
                    movie["writers"].append(list_writers)
                else:
                    movie["writers"] = list_writers
            list_writers = list(filter(lambda crew_member: crew_member['job'] == 'Writer', respJson["credits"]["crew"]))[:3]
            if len(list_writers)!=0:
                if(len(movie["writers"])!=0):
                    movie["writers"].append(list_writers)
                else:
                    movie["writers"] = list_writers
            movie["cast"] = respJson["credits"]["cast"][:5]
            movie["background_image"] = respJson["backdrop_path"]
            return JsonResponse(movie, safe=False)
        else:
            raise Http404

@api_view()
def TrendingMoviesView(request):
    resp = requests.get(f"https://api.themoviedb.org/3/trending/movie/week?api_key={API_KEY}")
    resp.encoding = "utf-8"
    respJson = resp.json()
    results = respJson["results"]
    trending_movies = []
    for result in results:
        trending_movie = {}
        trending_movie["title"] = result["title"]
        trending_movie["poster_path"] = result["poster_path"]
        trending_movie["vote_average"] = result["vote_average"]
        trending_movie["overview"] = result["overview"]
        trending_movie["id"] = result["id"]
        date = dtime.fromisoformat(result["release_date"])
        trending_movie["year"] = date.year
        genre_ids = []
        genre_names = []
        genre_ids = result["genre_ids"]
        for genre_id in genre_ids:
            if(genre_id in genres_gathered):
                genre_names.append(genres_gathered[genre_id])
            else:
                genre_resp = requests.get("https://api.themoviedb.org/3/genre/{}?api_key=aac569ce5b81de3e31bee34323e9745e".format(genre_id))
                genre_respJson = genre_resp.json()
                id = genre_respJson["id"]
                name = genre_respJson["name"]
                genres_gathered[id] = name
                genre_names.append(name)
        trending_movie["genres"] = genre_names
        trending_movies.append(trending_movie)
    return JsonResponse(trending_movies, safe=False)

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

class LoginView(APIView):
    def post(self, request):
        username = request.data["username"]
        password = request.data["password"]
        user = User.objects.filter(username=username).first()
        if user is None:
            raise AuthenticationFailed("User cannot be found!")
        #comparing hashed password
        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password!")
        payload = {
            "id": user.id,
            "username": user.username
        }
        token = jwt.encode(payload, "secret", algorithm="HS256").decode("utf-8")
        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=True)
        response.data = {
            "jwt": token
        }
        return response

class AddFavorite(APIView):
    def post(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated!")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except:
            raise AuthenticationFailed("Unauthenticated!")
        user = User.objects.filter(username=payload["username"]).first()
        movie_id = request.data["movie_id"]
        record = FavoriteMovies.objects.filter(username=user.username).filter(movie_id=movie_id).first()
        if record:
            raise PermissionDenied("Already liked this movie!")
        new_favorite = FavoriteMovies()
        new_favorite.username = user.username
        new_favorite.movie_id = movie_id
        new_favorite.save()
        response = Response()
        response.data = {
            "message": "successful"
        }
        return response

class RemoveFavorite(APIView):
    def get(self, request, movie_id):
        username = getUsername(request.COOKIES.get("jwt"))
        response = Response()
        if FavoriteMovies.objects.filter(username=username).filter(movie_id=movie_id).first():
            FavoriteMovies.objects.filter(username=username).filter(movie_id=movie_id).delete()
            response.data = {
                "message": "successful"
            }
        else:
            raise PermissionDenied() 
        return response

class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated!")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except:
            raise AuthenticationFailed("Unauthenticated!")
        user = User.objects.filter(username=payload["username"]).first()
        user_serialized = UserSerializer(user)
        return Response(user_serialized.data)


class IsMovieLiked(APIView):
    def get(self, request, movie_id):
        token = request.COOKIES.get("jwt")
        if not token:
            raise AuthenticationFailed("Unauthenticated!")
        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])
        except:
            raise AuthenticationFailed("Unauthenticated!")
        username=payload["username"]
        response = Response()
        if FavoriteMovies.objects.filter(username=username).filter(movie_id=movie_id).first():
            response.data = {
                "isMovieLiked": "true"
            }
        else:
            response.data = {
                "isMovieLiked": "false"
            }
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {
            "message": "successful"
        }
        return response
