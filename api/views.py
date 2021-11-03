from datetime import datetime
import pip._vendor.requests as requests
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
import jwt, datetime

genres_gathered = {}

# Create your views here.

@api_view()
def TrendingMoviesView(request):
    resp = requests.get("https://api.themoviedb.org/3/trending/movie/week?api_key=aac569ce5b81de3e31bee34323e9745e")
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
        date = datetime.fromisoformat(result["release_date"])
        trending_movie["year"] = date.year
        genre_ids = []
        genre_names = []
        genre_ids = result["genre_ids"]
        for genre_id in genre_ids:
            print(genres_gathered)
            if(genre_id in genres_gathered):
                print("here")
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


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {
            "message": "successful"
        }
        return response