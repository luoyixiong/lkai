"""lkai_web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from app import views

urlpatterns = [
    path('admin/theme/data', views.data),
    path('admin/', admin.site.urls),
    path('index/', views.index),
    path('f_search/', views.f_search),
    path('search/', views.index),
    # path('index/bussiness/', views.bussiness),
    # path('insert_quota/', views.insert_quota),
    path('index/insert/', views.insert),
    path('login/', views.login),
    path("index/bussiness_search/", views.bussiness_search),
    path('test2/', views.test2),
    path('index/getEdit', views.getEdit),
    path('index/getProp', views.getProp),
    path('index/getUserInfo', views.getUserInfo),
    path('index/bussiness2/', views.bussiness2),
    path('index/search', views.search),
]
