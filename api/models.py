from django.db import models
from django.db.models.fields import TextField

# Create your models here.
class User(models.Model):
    username = models.TextField(max_length=20, unique=True, primary_key=True)
    password = models.TextField(max_length=50)