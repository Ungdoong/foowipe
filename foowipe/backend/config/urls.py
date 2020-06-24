from django.urls import path
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers
from rest_framework_swagger.views import get_swagger_view
from foowipe.views import *
from foowipe.store_api import get_store_id, get_store_menu, get_rating, get_img

app_name='foowipe'

router = routers.DefaultRouter()

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^api/doc/', get_swagger_view(title='Foowipe Swagger')),
    path('auth/signup/', signup, name='signup'),
    path('auth/login/', login, name='login'),
    path('auth/logout/', logout, name='logout'),
    path('auth/user/<int:user_id>/', user, name='user'),
    path('store/rating/', get_rating),
    path('store/', get_store_id),
    path('store/menu/', get_store_menu),
    path('store/list/', find_store, name='find_store'),
    path('store/search/', search_store, name='search_store'),
    path('store/menulist/', search_store_menu, name='search_store_menu'),
    path('likey/list/', likey_list, name='likey_list'),
    path('likey/add/', add_likey, name='add_likey'),
    path('likey/remove/', remove_likey, name='remove_likey'),
    path('store/img/', get_img)
]