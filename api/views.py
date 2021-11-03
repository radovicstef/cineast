from datetime import datetime
import pip._vendor.requests as requests
from django.shortcuts import render
from django.core import serializers as ser
from pip._vendor.requests.models import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import UserSerializer
from .models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view

from api import serializers

genres_gathered = {}

# Create your views here.

@api_view()
def TrendingMovies(request):
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

@api_view()
def Users(request):
    users = User.objects.all()
    serialized_users = UserSerializer(users, many=True)
    print(serialized_users)
    return JsonResponse(serialized_users.data, safe=False)
