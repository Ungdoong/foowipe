from django.conf import settings
from django.db import models
from django.utils import timezone

# Create your models here.
class User(models.Model):
    id=models.IntegerField()
    nickname=models.CharField(max_length=30)
    birth=models.CharField(max_length=30)
    gender=models.CharField(max_length=30)
    email=models.CharField(max_length=30)
    phone=models.CharField(max_length=30)
    reg_date=models.DateTimeField()
    password=models.CharField(max_length=30)
    
class Store(models.Model):
    id=models.IntegerField()
    name=models.CharField(max_length=30)
    latitude=models.CharField(max_length=30)
    longitude=models.CharField(max_length=30)
    code=models.CharField(max_length=30)
    address=models.CharField(max_length=30)
    contact=models.CharField(max_length=30)

class Menu(models.Model):
    id=models.IntegerField()
    name=models.CharField(max_length=30)
    price=models.CharField(max_length=30)
    store_id=models.CharField(max_length=30)

class Likey(models.Model):
    id=models.IntegerField()
    id2=models.IntegerField()
    id3=models.IntegerField()
    likey_date=models.DateTimeField()
    
class Store_Detail(models.Model):
    id=models.IntegerField()
    id2=models.IntegerField()
    review_num=models.IntegerField()
    likey_num=models.IntegerField()
    grade=models.FloatField()
    selected_num=models.IntegerField()
