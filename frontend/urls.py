from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('about', index),
    path('login', index),
    path('register', index),
    path('welcome', index),
    path('movie/<int:id>', index),
    path('explore', index),
    path('favorites', index)
]
