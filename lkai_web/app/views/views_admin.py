from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect

from app.models import User, Entity
import json


def index(request):
    user_list = User.objects.filter().all()
    users = []
    global_dic = {'total': len(Entity.objects.all()),
                  'unallocated': len(Entity.objects.filter(check_name=None)), }

    for user in user_list:
        users.append({'id': user.id, 'name': user.name})
    for user in users:
        user['totalNum'] = len(Entity.objects.filter(check_name=user['name']))

        user['finishedNum'] = len(Entity.objects.filter(check_name=user['name'], check__gt=0))

    return render(request, "index_admin.html", {'users': users, 'global_dic': global_dic})


def excuteTask(request):
    # noneTask = Entity.objects.filter(check_name=None)
    # for task in noneTask[:2]:
    #     Entity.objects.filter(id=task.id).update(check_name='chenlu')
    if request.is_ajax():
        data = json.loads(request.body.decode('utf-8'))
        flag = data['flag']
        number = int(data['taskNum'])
        name = data['name']
        if flag == 1:
            noneTasks = Entity.objects.filter(check_name=None)
            if len(noneTasks) < number:
                return HttpResponse(json.dumps({'resultCode': 'gt'}, default={}, ensure_ascii=False),
                                    content_type='application/json')
            else:
                for task in noneTasks[:number]:
                    task.check_name = name
                    task.save()
        elif flag == 0:
            userTask = Entity.objects.filter(check_name=name, check=0)
            for task in userTask[:number]:
                task.check_name = None
                task.save()
        else:
            print("def excuteTask flag is " + flag + " not in [0,1]")

    return HttpResponse(json.dumps({'resultCode': 'ok'}, default={}, ensure_ascii=False),
                        content_type='application/json')
