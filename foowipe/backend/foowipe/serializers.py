from .models import Store, User
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('user_id', 'email', 'nickname')


class StoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Store
        fields = ('store_id', 'name', 'latitude', 'longitude', 'code', 'address', 'contact', 'category')
