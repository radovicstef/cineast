from django.db import models
from django.db.models.fields import CharField

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=50)

class Movie(models.Model):
    adult = models.BooleanField()
    backdrop_path = models.CharField(max_length=200)
    belongs_to_collection = models.CharField(max_length=200)
    budget = models.IntegerField()
    genres = models.CharField(max_length=200)
    homepage = models.CharField(max_length=200)
    id = models.IntegerField(primary_key=True)
    imdb_id = models.CharField(max_length=200)
    original_language = models.CharField(max_length=200)
    original_title = models.CharField(max_length=200)
    overview = models.CharField(max_length=5000)
    popularity = models.DecimalField(max_digits=10, decimal_places=3)
    poster_path = models.CharField(max_length=200)
    production_companies = models.CharField(max_length=5000)
    production_countries = models.CharField(max_length=5000)
    release_date = models.CharField(max_length=2000)
    revenue = models.BigIntegerField()
    runtime = models.IntegerField()
    spoken_languages = models.CharField(max_length=2000)
    status = models.CharField(max_length=200)
    tagline = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    video = models.BooleanField()
    vote_average = models.DecimalField(max_digits=10, decimal_places=1)
    vote_count = models.IntegerField()
    