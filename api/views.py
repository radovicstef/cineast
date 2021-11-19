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
from api.utils import getUsername
import json
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from iso639 import languages

genres_gathered = {}

API_KEY = "aac569ce5b81de3e31bee34323e9745e"

cachedStopWords = stopwords.words("english")

similar_movies = []
sorted_similar_movies = []
favorite_movies = []

def find_similar_movies(username):
    global favorite_movies
    print("Finding similar movies...")
    global similar_movies, sorted_similar_movies
    favorite_movies = list(FavoriteMovies.objects.filter(username=username).values("movie_id"))

    if(len(favorite_movies) == 0):
        pass

    favorite_movies_index = []
    print("Favorite movies:")
    for favorite_movie in favorite_movies:
        #print("----------------")
        #print("id: " + str(favorite_movie["movie_id"]))
        #print(movies_df.loc[movies_df['id'] == favorite_movie["movie_id"]].iloc[0]["index"])
        favorite_movies_index.append(index[movies_df['id'] == favorite_movie["movie_id"]].tolist()[0])

    print(favorite_movies_index)

    i = 0
    for favorite_movie in favorite_movies_index:
        if i == 0:
            i=1
            similar_movies =  list(enumerate(cosine_sim[favorite_movie]))
        else:
            new_similarity = list(enumerate(cosine_sim[favorite_movie]))
            for i in range(0, len(similar_movies)):
                similar_movies[i] = (similar_movies[i][0], similar_movies[i][1] + new_similarity[i][1])


    sorted_similar_movies = sorted(similar_movies,key=lambda x:x[1],reverse=True)


def combine_features(row):
    try:
        cast = row["cast"].replace(" ", "").replace("|", " ").lower()
        director = row["director"].replace(" ", "").replace("|", " ").lower()
        genres = row["genres"].replace("|", " ").lower()
    except:
        cast = ""
        director = ""
        genres = ""
    #language = str(row["original_language_full"])
    combined_features = genres + " " + row["original_title"].lower() + " " + cast + " " + director + str(row["overview_short"]).lower()
    return combined_features

def remove_stopwords(row):
    try:
        overview_short = ' '.join([word.replace(",", "").replace(".", "").replace('"', "").lower() for word in row["overview"].split() if word.replace(",", "").replace(".", "").lower() not in cachedStopWords])      
        return overview_short
    except:
        return row["overview"]
    #if row["original_language_full"] in cachedStopWords.keys():
        #try:
            #overview_short = ' '.join([word.replace(",", "").replace(".", "").lower() for word in row["overview"].split() if word.replace(",", "").replace(".", "").lower() not in cachedStopWords[row["original_language_full"]]][:15])
            #return overview_short
        #except:
            #return row["overview"]
    #else:
        #return row["overview"]

movies_df = pd.read_csv("movie_dataset.csv")
movies_df['json'] = movies_df.apply(lambda x: x.to_json(), axis=1)
index = movies_df.index
#movies_df["original_language_full"] = movies_df["original_language"].apply(lambda x: languages.get(alpha2=str(x)).name.lower())

#for language in movies_df["original_language_full"].drop_duplicates():
    #try:
        #cachedStopWords[language] = stopwords.words(language)
        #if language == "english":
           #print(cachedStopWords[language])
    #except:
        #continue

movies_df["overview_short"] = movies_df.apply(remove_stopwords, axis=1)

movies_df["combined_features"] = movies_df.apply(combine_features, axis=1)

cv = CountVectorizer()

count_matrix = cv.fit_transform(movies_df["combined_features"])

cosine_sim = cosine_similarity(count_matrix)
print("COSINE_SIM")
print(cosine_sim)

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
        find_similar_movies(username)
        return response

class GetFavoriteMovies(APIView):
    def get(self, request):
        username = getUsername(request.COOKIES.get("jwt"))
        favorite_movies = list(FavoriteMovies.objects.filter(username=username).values("movie_id"))
        return JsonResponse(favorite_movies, safe=False)

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

class ExploreMovies(APIView):
    def get(self, request, page):
        index_begin = (page-1)*12 + len(favorite_movies)
        index_end = page*12 + len(favorite_movies)
        movies_json = []
        
        #for movie_df in movies_df["json"][index_begin:index_end]:
            #movies_json.append(json.loads(movie_df))

        for i in range(index_begin, index_end):
            try:
                movies_json.append(json.loads(movies_df.iloc[sorted_similar_movies[i][0]]["json"]))
            except:
                continue

        return JsonResponse(movies_json, safe=False)

class GetNumPages(APIView):
    def get(self, request):
        return JsonResponse(int(movies_df.shape[0]/12), safe=False)


class SearchMovie(APIView):
    def get(self,request, movie):
        searched_movies_same = movies_df["json"][movies_df["original_title"].str.lower() == movie.lower()]
        searched_movies = movies_df["json"][movies_df["original_title"].str.contains(movie, na=False, case=False)]
        searched_movies_same = searched_movies_same.tolist()
        searched_movies_same_length = len(searched_movies_same) if len(searched_movies_same)!=0 else 1
        searched_movies = searched_movies_same + searched_movies.tolist()[0:3*searched_movies_same_length - len(searched_movies_same)]
        searched_movies_json = []
        for searched_movie in searched_movies:
            searched_movies_json.append(json.loads(searched_movie))
        return JsonResponse(searched_movies_json, safe=False)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie("jwt")
        response.data = {
            "message": "successful"
        }
        return response
