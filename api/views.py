from datetime import datetime as dtime
from operator import index
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
import numpy as np
from api.utils import getUsername
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from iso639 import languages
from api.constants import API_KEY

# Global variables
genres_gathered = {}
cachedStopWords = stopwords.words("english")

# Gathers genres from the TMDB API and stores to genres_gathered, so that the names are accessable by the genre id
def gather_genres():
    global genres_gathered
    resp = requests.get(f"https://api.themoviedb.org/3/genre/movie/list?api_key={API_KEY}")
    genres = resp.json()
    for genre in genres["genres"]:
        genres_gathered[genre["id"]] = genre["name"]


# Takes row as a prameter and returnes combined_features string that will be used in calculating content similarity
def combine_features(row):
    try:
        cast = row["cast"].replace(" ", "").replace("|", " ").lower()
        director = row["director"].replace(" ", "").replace("|", " ").lower()
        genres = row["genres"].replace("|", " ").lower()
    except:
        cast = ""
        director = ""
        genres = ""
    combined_features = genres + " " + row["original_title"].lower() + " " + cast + " " + director + str(row["overview_short"]).lower()
    return combined_features


# Removes stopwords from the overview_short, so that it only contains keywords
def remove_stopwords(row):
    try:
        overview_short = ' '.join([word.replace(",", "").replace(".", "").replace('"', "").lower() for word in row["overview"].split() if word.replace(",", "").replace(".", "").lower() not in cachedStopWords])      
        return overview_short
    except:
        return row["overview"]


# Load movie dataset csv file
movies_df = pd.read_csv("movie_dataset.csv")

# Add json, overview_short, combined_features columns
movies_df["json"] = movies_df.apply(lambda x: x.to_json(), axis=1)
movies_df["overview_short"] = movies_df.apply(remove_stopwords, axis=1)
movies_df["combined_features"] = movies_df.apply(combine_features, axis=1)

# Index structure with the first row id=135397 having 0 index
index = movies_df.index

# Sklearn count vectorizer that converts a collection of text documents to a matrix of token counts
cv = CountVectorizer()

# fit_transform learns the vocabulary dictionary and returns document-term matrix
count_matrix = cv.fit_transform(movies_df["combined_features"])

# Compute cosine similarity between all samples in count_matrix
# Returns 10722x10722 matrix that has 0-1 value, 1 on the main diagonal of matrix
cosine_sim = cosine_similarity(count_matrix)
gather_genres()


# This method is called after the favorite movies list is updated
# It sorts the list of movie suggestions by content similarity
# It uses cosine_sim matrix with the movie-to-movie similarity_index for each pair of the movies
def find_similar_movies(username):
    user_model = User.objects.get(username=username)
   
    favorite_movies = list(FavoriteMovies.objects.filter(username=username).values("movie_id"))  # the list of dictionaries {"movies_id": id_value}

    # if user has empty list of favorite movies, no suggestion is retur
    if(len(favorite_movies) == 0):
        pass

    favorite_movies_index = []  # the array of indexes of user's favorite movies
    for favorite_movie in favorite_movies:
        favorite_movies_index.append(index[movies_df['id'] == favorite_movie["movie_id"]].tolist()[0])

    i = 0
    similar_movies = list()
    for favorite_movie in favorite_movies_index:
        if i == 0:  # creates similar_movies list of tuples (dataset_index, similarity_index [value 0-1])
            i=1
            similar_movies =  list(enumerate(cosine_sim[favorite_movie]))
        # if the favorite movie is not the first one from the list, 
        # create a new_similarity list of similar movies, based on the current favorite_movie
        # sum the similarity_index value of the similar_movies and new_similarity lists
        else:  
            new_similarity = list(enumerate(cosine_sim[favorite_movie]))
            for i in range(0, len(similar_movies)):
                similar_movies[i] = (similar_movies[i][0], similar_movies[i][1] + new_similarity[i][1])

    # sorted_similar_movies is the sorted list similar_movies based on the similarity_index value
    sorted_similar_movies = sorted(similar_movies,key=lambda x:x[1],reverse=True)

    # sorted_similar_movies_index creates array of dataframe_indexes out of tuple (dataframe_index, similarity_index)
    sorted_similar_movies_index = [i[0] for i in sorted_similar_movies]
    sorted_similar_movies_index_json = json.dumps(sorted_similar_movies_index)

    # initially sorted_similar_movies_json and filtered_similar_movies_json are the same, since no filter is applied
    user_model.sorted_similar_movies_json = sorted_similar_movies_index_json
    user_model.filtered_similar_movies_json = sorted_similar_movies_index_json
    user_model.save()


# Create your views here.

# Get movie details, based on the movie id
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


# Get movie short overview, based on the movie id
class MovieOverview(APIView):
    def get(self, request, movie_id):
        resp = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}")
        resp.encoding = "utf-8"
        movie = {}
        if resp.ok:
            respJson = resp.json()
            movie["title"] = respJson["title"]
            movie["overview"] = respJson["overview"]
            movie["poster_path"] = respJson["poster_path"]
            movie["rating"] = respJson["vote_average"]
            movie["genres"] = []
            for genre in respJson["genres"]:
                movie["genres"].append(genre["name"])
            try:
                date = dtime.fromisoformat(respJson["release_date"])
                movie["year"] = date.year
            except:
                movie["year"] = ""
            return JsonResponse(movie, safe=False)
        else:
            raise Http404


# Get trending movies from TMDB API
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
                genre_resp = requests.get("https://api.themoviedb.org/3/genre/{}?api_key={API_KEY}".format(genre_id))
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
        user_model = User.objects.filter(username=username).first()

        if user_model is None:
            raise AuthenticationFailed("User cannot be found!")

        # Comparing hashed password
        if not user_model.check_password(password):
            raise AuthenticationFailed("Incorrect password!")

        # Payload that will be hashed and stored to JWT token    
        payload = {
            "id": user_model.id,
            "username": user_model.username
        }
        token = jwt.encode(payload, "secret", algorithm="HS256").decode("utf-8")

        response = Response()
        response.set_cookie(key="jwt", value=token, httponly=True)
        response.data = {
            "jwt": token
        }
        return response


# Get user's favorite movies
class GetFavoriteMovies(APIView):
    def get(self, request):
        username = getUsername(request.COOKIES.get("jwt"))
        favorite_movies = list(FavoriteMovies.objects.filter(username=username).values("movie_id"))
        return JsonResponse(favorite_movies, safe=False)


# Add favorite movie and updats the sorted similar movies list by calling find_similar_movies(username)
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
        find_similar_movies(user.username)
        response = Response()
        response.data = {
            "message": "successful"
        }
        return response


# Remove favorite movie and update the sorted similar movies list by calling find_similar_movies(username)
class RemoveFavorite(APIView):
    def get(self, request, movie_id):
        username = getUsername(request.COOKIES.get("jwt"))
        response = Response()
        if FavoriteMovies.objects.filter(username=username).filter(movie_id=movie_id).first():
            FavoriteMovies.objects.filter(username=username).filter(movie_id=movie_id).delete()
            find_similar_movies(username)
            response.data = {
                "message": "successful"
            }
        else:
            raise PermissionDenied() 
        return response


# Get if the user is authenticated
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


# Get if movie is liked, based on the movie id
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


# Get 12 movies that should be displayed, based on the catalog page number 
class ExploreMovies(APIView):
    def get(self, request, page):
        username = getUsername(request.COOKIES.get("jwt"))
        user_model = User.objects.get(username=username)
        filtered_similar_movies = json.loads(user_model.filtered_similar_movies_json)
        favorite_movies = list(FavoriteMovies.objects.filter(username=username).values("movie_id"))
       
        favorite_movies_index = []
        for favorite_movie in favorite_movies:
            favorite_movies_index.append(index[movies_df['id'] == favorite_movie["movie_id"]].tolist()[0])

        # favorite_movies is a list of favorites movies that is in filtered_similar_movies list
        favorite_movies = list(set(favorite_movies_index).intersection(filtered_similar_movies))

        # favorite movies should not be displayed (they are in the sorted list of similar movies)
        index_begin = (page-1)*12 + len(favorite_movies)
        index_end = page*12 + len(favorite_movies)
        movies_json = []

        for i in range(index_begin, index_end):
            try:
                movies_json.append(json.loads(movies_df.iloc[filtered_similar_movies[i]]["json"]))
            except:
                continue

        return JsonResponse(movies_json, safe=False)


# Filter the user's sorted similar movie list, based on the passed filters
class FilterSortedMovies(APIView):
    def get(self, request, genre, rating, year):
        username = getUsername(request.COOKIES.get("jwt"))
        user_model = User.objects.get(username=username)
        sorted_similar_movies = json.loads(user_model.sorted_similar_movies_json)

        movies_query = movies_df

        if(genre == "All" and rating == "All" and year == "All"):
            user_model.filtered_similar_movies_json = user_model.sorted_similar_movies_json
            user_model.save()
            return JsonResponse("ok", safe=False)
        if(genre != "All"):
            movies_query = movies_query[movies_query["genres"].str.contains(genre, na=False)]
        if(rating != "All"):
            if(rating == "5+"):
                movies_query = movies_query.query('vote_average >= 5')
            if(rating == "7+"):
                movies_query = movies_query.query('vote_average >= 7')
            if(rating == "9+"):
                movies_query = movies_query.query('vote_average >= 9')
        if(year != "All"):
            if(year == "1950-1990"):
                movies_query = movies_query.query('release_year >= 1950 and release_year <= 1990')
            if(year == "1990-2000"):
                movies_query = movies_query.query('release_year >= 1990 and release_year <= 2000')
            if(year == "2000-2010"):
                movies_query = movies_query.query('release_year >= 2000 and release_year <= 2010')
            if(year == "2010-2021"):
                movies_query = movies_query.query('release_year >= 2010 and release_year <= 2021')
        
        movies_query = [x for x in movies_query.index.tolist()]
        # filtered_similar_movies_final stores only filtered movies from movies_query, in the same order as sorted_similar_movies
        filtered_similar_movies_final = sorted(set(sorted_similar_movies) & set(movies_query), key=sorted_similar_movies.index)
        filtered_similar_movies_final_json = json.dumps(filtered_similar_movies_final)
        
        user_model.filtered_similar_movies_json = filtered_similar_movies_final_json
        user_model.save()

        return JsonResponse("ok", safe=False)


# Get number of pages of the catalog, based on the number of movies
class GetNumPages(APIView):
    def get(self, request):
        username = getUsername(request.COOKIES.get("jwt"))
        user_model = User.objects.get(username=username)
        filtered_similar_movies = json.loads(user_model.filtered_similar_movies_json)
        return JsonResponse(int(len(filtered_similar_movies)/12), safe=False)


# Get list of movie suggestions based on the search input
class SearchMovie(APIView):
    def get(self,request, movie):
        # searched_movies_same contains exact matches
        searched_movies_same = movies_df[movies_df["original_title"].str.lower() == movie.lower()]
        
        # searched_movies contains matches
        searched_movies = movies_df[movies_df["original_title"].str.contains(movie, na=False, case=False)]
        
        searched_movies_list = searched_movies["json"].tolist()
        searched_movies_same_list = searched_movies_same["json"].tolist()

        for movie in searched_movies_same["id"].tolist():
            if movie in searched_movies["id"].tolist()[:3]:
                searched_movies_same_list = []
                break

        # searched_movies_list should be dividable by 3 to suit UI, it should contain all the exact matches and optionally some matches
        searched_movies_same_length = len(searched_movies_same_list) if len(searched_movies_same_list)!=0 else 1
        searched_movies_list = searched_movies_same_list + searched_movies_list[0:3*searched_movies_same_length - len(searched_movies_same_list)]
        
        searched_movies_json = []
        for searched_movie in searched_movies_list:
            searched_movies_json.append(json.loads(searched_movie))

        return JsonResponse(searched_movies_json, safe=False)


class LogoutView(APIView):
    def post(self, request):
        username = getUsername(request.COOKIES.get("jwt"))
        user_model = User.objects.get(username=username)
        # Logging out will undo filtering on sorted similar movies in the database
        user_model.filtered_similar_movies_json = user_model.sorted_similar_movies_json
        user_model.save()
        response = Response()
        response.delete_cookie("jwt")
        response.data = {
            "message": "successful"
        }
        return response
