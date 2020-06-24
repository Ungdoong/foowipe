from django.db import models
from django.utils import timezone
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=255)
    nickname = models.CharField(null=True, max_length=30)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        db_table = "user"

class Store(models.Model):
    store_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    latitude = models.CharField(max_length=100, null=True)
    longitude = models.CharField(max_length=100, null=True)
    code = models.CharField(max_length=100, null=True)
    address = models.CharField(max_length=100, null=True)
    contact = models.CharField(max_length=100, null=True)
    category = models.CharField(max_length=100, null=True)
    score = models.IntegerField(default=0)

    class Meta:
        db_table = "store"


class Menu(models.Model):
    menu_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    price = models.CharField(max_length=100, null=True)
    store = models.ForeignKey('Store', on_delete=models.CASCADE)

    class Meta:
        db_table = "menu"


class Likey(models.Model):
    likey_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    store = models.ForeignKey('Store', on_delete=models.CASCADE)
    likey_date = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "likey"


class Store_Detail(models.Model):
    store_detail_id = models.AutoField(primary_key=True)
    store = models.ForeignKey('Store', on_delete=models.CASCADE)
    review_num = models.IntegerField(default=0)
    likey_num = models.IntegerField(default=0)
    selected_num = models.IntegerField(default=0)
    grader_num = models.IntegerField(default=0)
    total_grade = models.IntegerField(default=0)

    class Meta:
        db_table = "store_detail"
