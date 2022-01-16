from enum import unique
from django.db import models
from django.db.models.fields import CharField, TextField
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    filtered_similar_movies_json = models.TextField(default="[]")
    sorted_similar_movies_json = models.TextField(default="[]")


    REQUIRED_FIELDS = []

class FavoriteMovies(models.Model):
    username = models.CharField(max_length=255)
    movie_id = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["username", "movie_id"], name='Unique favorite movie for user'),
        ]
    