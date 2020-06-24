import json
from .models import Store, Store_Detail, Menu, Likey
from django.core import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib.request import Request
from urllib.parse import quote

@api_view(['POST',])
@permission_classes((AllowAny, ))
def get_store_id(request):
    store_id = request.data.get('id', None)
    store = Store.objects.filter(store_id = store_id)
    store_data = serializers.serialize('json',store)
    store_dic = json.loads(store_data[1:-1])
    return Response(store_dic['fields'])


@api_view(['POST',])
@permission_classes((AllowAny, ))
def get_store_menu(request):
    store_id = request.data.get('id', None)
    menu = Menu.objects.filter(store_id=store_id)
    data = {}
    for m in menu:
        dic = {}
        dic["menu_id"] = m.menu_id
        dic["name"] = m.name
        dic["price"] = m.price
        data[m.menu_id] = dic
    return Response(data)


@api_view(['POST',])
@permission_classes((AllowAny, ))
def get_rating(request):
    address = request.data.get('address',None)
    entries = Store.objects.filter(address__contains = address)
    cal = {}
    for store in entries:
        store_id = store.store_id
        store_detail = Store_Detail.objects.filter(store_id=store_id)
        store_detail_data = serializers.serialize('json', store_detail)
        store_dic = json.loads(store_detail_data[1:-1])
        store_detail = store_dic['fields']
        likey_num = store_detail['likey_num']
        review_num = store_detail['review_num']
        selected_num = store_detail['selected_num']
        grader_num = store_detail['grader_num']
        total_grade = store_detail['total_grade']
        if total_grade != 0:
            rate = likey_num * 0.25 + review_num * 0.25 + selected_num * 0.25 + (grader_num / total_grade) * 0.25
        else:
            rate = likey_num * 0.25 + review_num * 0.25 + selected_num * 0.25
        if rate != 0:
            cal[store_id] = rate
    result = sorted(cal.items(), key=lambda x: x[1], reverse=True)[:100]
    data = {}
    for res in result:
        id = res[0]
        store = Store.objects.filter(store_id = id)
        store_data = serializers.serialize('json', store)
        store_dic = json.loads(store_data[1:-1])['fields']
        store_dic["store_id"] = id
        data[id] = store_dic
    return Response(data)

@api_view(['POST',])
@permission_classes((AllowAny, ))
def get_img(request):
    address = request.data.get('address', None)
    name = request.data.get('name', None)
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
            data = {}
            data["src"] = img_src
            return Response(data)
    return Response(None)