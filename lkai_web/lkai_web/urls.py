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

from app.views import views_admin, views_user


urlpatterns = [
    path('assign/', views_admin.index),
    path('assign/task', views_admin.excuteTask),
    # path('admin/', admin.site.urls),

    path('index/', views_user.index),
    path('f_search/', views_user.f_search),
    # path('search/', views.index),
    # path('index/bussiness/', views.bussiness),
    # path('insert_quota/', views.insert_quota),
    path('index/insert/', views_user.insert),
    path('login/', views_user.login),
    path("index/bussiness_search/", views_user.bussiness_search),

    path('index/getEdit', views_user.getEdit),
    path('index/getProp', views_user.getProp),
    path('index/getUserInfo', views_user.getUserInfo),
    path('index/bussiness2/', views_user.bussiness2),
    path('index/search', views_user.search),
    path('index/getAllZB', views_user.getAllZB),
    path('index/jumpZB', views_user.jumpZB),

    path('test2/', views_user.test2),
]
