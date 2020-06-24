import json

from django.core import serializers
from django.contrib.auth import authenticate
from django.http import HttpResponse

from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_204_NO_CONTENT

from .models import User, Store, Likey, Menu
from .serializers import UserSerializer

from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.request import Request
from urllib.parse import quote

@api_view(['POST'])
@permission_classes((AllowAny,))
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)

    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Invalid credentials'}, status=HTTP_404_NOT_FOUND)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({'token': token.key, 'user_id': user.user_id, 'nickname': user.nickname}, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes((AllowAny,))
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')
    nickname = request.data.get('nickname')

    user = User.objects.create_user(email=email, password=password, nickname=nickname)

    if user:
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)


@api_view(['POST'])
def logout(request, format=None):
    request.user.auth_token.delete()
    data = {'success': 'Sucessfully logged out'}
    return Response(data=data, status=HTTP_200_OK)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes((AllowAny,))
def user(request, user_id):

    try:
        user_data = User.objects.get(user_id=user_id)
    except User.DoedNotExist:
        return Response(status=HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user_data)
        return Response(serializer.data)

    elif request.method == 'PUT':
        user_data.set_password(request.data.get('password'))
        user_data.nickname = request.data.get('nickname')
        user_data.save()
        serializer = UserSerializer(user_data)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user_data.delete()
        return Response(status=HTTP_204_NO_CONTENT)


# @api_view(['POST'])
# @permission_classes((AllowAny,))
# def find_store(request):
#     address = request.data.get('address', None)
#     category = request.data.get('category', None)
#
#     stores = Store.objects.filter(address__contains=address, category=category).order_by('-score')[:32]
#     store_data = json.loads(serializers.serialize('json', stores))
#
#     data = []
#     for store in store_data:
#         j1 = {'store_id': store['pk']}
#         merged = dict(j1, **store['fields'])
#         data.append(merged)
#
#     return Response(data=data)

@api_view(['POST'])
@permission_classes((AllowAny,))
def find_store(request):
    address = request.data.get('address', None)
    category = request.data.get('category', None)

    stores = Store.objects.filter(address__contains=address, category=category).order_by('-score')[:32]
    store_data = json.loads(serializers.serialize('json', stores))

    data = []
    for store in store_data:
        j1 = {'store_id': store['pk']}

        menus = Menu.objects.filter(store_id=store['pk'])
        menu_data = json.loads(serializers.serialize('json', menus))
        menulist = []
        for menu in menu_data:
            menulist.append(menu['fields'])
        j1["menu"] = menulist

        s1 = store['fields']
        img = get_img(s1['address'], s1['name'])
        j1["img"] = img

        merged = dict(j1, **store['fields'])
        data.append(merged)

    return Response(data=data)

def get_img(address, name):
    data = quote(address+name)
    url = "https://search.naver.com/search.naver?where=image&sm=tab_jum&query="+data
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urlopen(req)
    source = html.read()
    soup = BeautifulSoup(source, "html.parser")
    img = soup.find_all("img")
    for i in img:
        img_src = i.get("data-source")
        if img_src is not None:
            return img_src
    return None

@api_view(['POST'])
@permission_classes((AllowAny,))
def search_store(request):
    address = request.data.get('address', None)
    name = request.data.get('name', None)

    stores = Store.objects.filter(address__contains=address, name__contains=name).order_by('-score')[:32]
    store_data = json.loads(serializers.serialize('json', stores))

    data = []
    for store in store_data:
        j1 = {'store_id': store['pk']}
        merged = dict(j1, **store['fields'])
        data.append(merged)

    return Response(data=data)


@api_view(['POST'])
@permission_classes((AllowAny,))
def search_store_menu(request):
    address = request.data.get('address', None)
    name = request.data.get('name', None)

    stores = Store.objects.filter(address__contains=address, name__contains=name).order_by('-score')[:1]
    store_data = json.loads(serializers.serialize('json', stores))

    data = []
    for store in store_data:
        menus = Menu.objects.filter(store_id=store['pk'])
        menu_data = json.loads(serializers.serialize('json', menus))
        for menu in menu_data:
            data.append(menu['fields'])

    return Response(data=data)


@api_view(['POST'])
@permission_classes((AllowAny,))
def add_likey(request):
    user_id = request.data.get('user_id', None)
    store_id = request.data.get('store_id', None)

    likey = Likey(user_id=user_id, store_id=store_id)
    likey.save()

    store = Store.objects.get(store_id=store_id)
    store.score = store.score + 3
    store.save()

    data = {'success': 'Likey Add Sucess'}
    return Response(data=data, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes((AllowAny,))
def remove_likey(request):
    user_id = request.data.get('user_id', None)
    store_id = request.data.get('store_id', None)

    likey = Likey.objects.filter(user_id=user_id, store_id=store_id)
    likey.delete()

    store = Store.objects.get(store_id=store_id)
    store.score = store.score - 2
    store.save()

    data = {'success': 'Likey Delete Sucess'}
    return Response(data=data, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes((AllowAny,))
def likey_list(request):
    user_id = request.data.get('user_id', None)
    store_id = Likey.objects.filter(user_id=user_id)
    store_id_data = json.loads(serializers.serialize('json', store_id))

    keys = []
    for sid in store_id_data:
        keys.append(sid['fields']['store'])

    data = []
    for key in keys:
        store = Store.objects.filter(store_id=key)
        store_json = json.loads(serializers.serialize('json', store))
        for sj in store_json:
            j1 = {'store_id': sj['pk']}
            merged = dict(j1, **sj['fields'])
            data.append(merged)
            # data.append(sj['fields'])

    return Response(data=data)

