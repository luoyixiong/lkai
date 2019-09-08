import json
import time
from functools import wraps
from quota_model import Quota
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from xml.dom.minidom import Document
from app.models import PropDefault, PropertyData, Entity, User, EntityNew, PropertyDataNew

tag_list = [
    ["lkai.prop.报告名称", "lkai.prop.首字母缩写", "lkai.prop.别称", "lkai.prop.英文名称", "lkai.prop.英文缩写", "lkai.prop.大红本编码"],
    ["lkai.prop.定义", "lkai.prop.科室归类", "lkai.prop.人群划分", "lkai.prop.检查归类", "lkai.prop.是否空腹", "lkai.prop.参考价格",
     "lkai.prop.适宜人群", "lkai.prop.不适宜人群", "lkai.prop.何地检测", "lkai.prop.何时检测", "lkai.prop.出单时间"],
    ["lkai.prop.临床意义", "lkai.prop.参考范围", "lkai.prop.结果解读", "lkai.prop.相关疾病", "lkai.prop.相关症状", "lkai.prop.建议与指导"],
    ["lkai.prop.检查过程", "lkai.prop.检查注意事项", "lkai.prop.不良反应与风险"],
    ["lkai.prop.检测方法", "lkai.prop.样本要求", "lkai.prop.采样要求", "lkai.prop.保存条件", "lkai.prop.拒收条件"]
]

enumPropDic = {
    '检查归类': ['血常规', '尿常规', '便常规', '肝功能', '肾功能', '甲状腺功能', '血糖', '血脂', '肿瘤标志物', '激素检查',
             '血清电解质', '血清酶', '凝血功能', '微量元素', '生化检查', '病原体检查', '免疫学检查', '其他'],
    '科室归类': {'内科': ['心血管内科', '神经内科', '消化内科', '呼吸内科', '内分泌科', '肾病科', '血液内科', '感染科', '肝病科', '风湿免疫科', '老年病科', '变态反应科'],
             '外科': ['泌尿外科', '神经外科', '肝胆外科', '乳腺外科', '心血管外科', '胸外科', '乳腺外科', '肛肠科', '整形外科', '骨外科'],
             '儿科': ['小儿外科', '小儿内科', '新生儿科'],
             '妇产科': ['妇科', '产科', '计划生育科'],
             '五官科': ['耳鼻喉科', '口腔科', '眼科'],
             '皮肤性病科': ['皮肤科', '性病科'],
             '肿瘤科': ['肿瘤内科', '肿瘤外科', '放疗科', '肿瘤康复科'],
             '其他': [],
             },
    '人群划分': ['男性', '女性', '老人', '儿童'],
    '是否空腹': ['是', '否'],
}

tagPropDic = ['相关疾病', '相关症状', '建议与指导']

objectType = {"结果解读": ['高于正常值', '低于正常值', '阳性', '阴性'],
              "相关疾病": ['高于正常值', '低于正常值', '阳性', '阴性'],
              "相关症状": ['高于正常值', '低于正常值', '阳性', '阴性'],
              "建议与指导": ['高于正常值', '低于正常值', '阳性', '阴性'], }

listType = {"参考范围": ['性别', '年龄段', '范围'], }

# 全局变量，当读取一个指标时，同时读取它的所有属性 key：propid -> value: prop_value
prop_list = {}
prop_list_new = {}
formCheckList = [False] * 5


# 获得属性对应的数据
def getProp(request):
    global prop_list, prop_list_new

    result = ''
    propid = request.GET.get('propid')
    datatype = request.GET.getlist('datatype')[0]

    if datatype == 'new':
        if propid in prop_list_new:
            result = prop_list_new[propid]
            subpropid = request.GET.get('subpropid')
            if subpropid is not None:
                if subpropid in result:
                    result = result[subpropid]
                else:
                    result = ''
    elif datatype == 'old':
        if propid in prop_list:
            result = prop_list[propid]
    if isinstance(result, str):
        return HttpResponse(result)
    elif isinstance(result, list):
        return HttpResponse(json.dumps(result, default={}, ensure_ascii=False),content_type='application/json')
    else:
        return HttpResponse(status=404)


# 处理客户端提交的数据
def getEdit(request):
    if request.is_ajax():

        global formCheckList
        propList = json.loads(request.body)
        name = request.session.get("username_check")
        formIndex = propList[-1]
        print('formIndex: ', formIndex)

        for prop in propList[:-1]:
            if len(prop) > 0:
                print(prop)

                propVal = prop['value']
                propID = prop['propid']
                eid = prop['eid']
                if propVal != '':
                    formCheckList[formIndex - 1] = formCheckList[formIndex - 1] or prop['ischecked']

                    # 组合结构
                    if isinstance(propVal, dict):
                        zhibiao = PropertyDataNew.objects.filter(EID=eid, PROPID=propID, ownuser=name)
                        preObjid = ''
                        if len(zhibiao) == 1:
                            preObjid = zhibiao[0].prop_value
                        objid = str(time.time())
                        PropertyDataNew.objects.update_or_create(EID=eid, PROPID=propID,
                                                                 defaults={'doubt': prop['ischecked'],
                                                                           'prop_value': objid, 'ownuser': name})

                        parsePropDic(propVal, preObjid, objid, eid, prop['ischecked'], name)

                    elif isinstance(propVal, str):
                        # print(propVal)
                        PropertyDataNew.objects.update_or_create\
                            (EID=eid, PROPID=propID, defaults={'doubt': prop['ischecked'],
                                                               'prop_value': propVal, 'ownuser': name})
                    # 参考范围
                    elif isinstance(propVal, list):
                        CKFW = PropertyDataNew.objects.filter(EID=eid, PROPID=propID)
                        historyObiList = [item.prop_value for item in CKFW]
                        CKFW.delete()
                        for historyObi in historyObiList:
                            PropertyDataNew.objects.filter(EID=eid, objid=historyObi).delete()

                        for itemDic in propVal:
                            values = list(itemDic.values())

                            objid = str(time.time())
                            PropertyDataNew.objects.create(EID=eid, PROPID=propID, doubt=prop['ischecked'],
                                                           prop_value=objid, ownuser=name)
                            subPropidList = ['lkai.prop.性别', 'lkai.prop.年龄段', 'lkai.prop.范围']
                            for index, subPropid in enumerate(subPropidList):
                                PropertyDataNew.objects.create(EID=eid, PROPID=subPropid, doubt=prop['ischecked'],
                                                               ownuser=name, objid=objid, prop_value=values[index])
                    else:
                        print(type(prop['value']), prop['value'])
        if formIndex == 5:
            zbDoubt = False
            for formCheck in formCheckList:
                zbDoubt = formCheck or zbDoubt
            Entity.objects.update_or_create(EID=prop['eid'], check_name=name, defaults={'check': 1})
            if not zbDoubt:
                doubt = 0
            else:
                doubt = 1
            EntityNew.objects.update_or_create(EID=prop['eid'], CPTID='lkai.检验指标', ownuser=name, check_name=name,
                                               name=prop['eid'].split('.')[-1], defaults={'doubt': doubt})
        return HttpResponse(status=200)

    return HttpResponse(status=404)


def parsePropDic(propDic, preObjid, objid, eid, ischecked, name):
    for dic in propDic.values():
        propID = dic['propid']
        value = dic['value']
        if isinstance(value, str):
            if preObjid != '':

                PropertyDataNew.objects.update_or_create(EID=eid, PROPID=propID, objid=preObjid,
                                                         defaults={'doubt': ischecked, 'prop_value': value,
                                                                   'ownuser': name,
                                                                   'objid': objid, })
            else:
                PropertyDataNew.objects.update_or_create(EID=eid, PROPID=propID, objid=objid,
                                                         defaults={'doubt': ischecked, 'prop_value': value,
                                                                   'ownuser': name, })
        # elif isinstance(value, dict):
        # subObjid = str(time.time())
        # PropertyDataNew.objects.update_or_create(EID=eid, PROPID=propID, objid=objid,
        #                                         defaults={'doubt': ischecked, 'prop_value': subObjid, 'ownuser': name})
        # parsePropDic(value, subObjid, eid, ischecked, name)


# 返回用户已校验过的信息
def getUserInfo(request):
    userDic = {}

    userName = request.session['username_check']
    userDic['userName'] = userName
    unfinished = Entity.objects.filter(check_name=userName, check=0)
    if len(unfinished) > 0:
        if request.session.get('eid') is None:
            eid = unfinished[0].EID
            request.session['eid'] = eid

    else:
        return render(request, 'index_test.html')
    eid = request.session['eid']
    userDic['itemName'] = eid

    finished = Entity.objects.filter(check_name=userName, check=1)

    userDic['finished'] = len(finished)
    userDic['unfinished'] = len(unfinished)
    userDic['all'] = userDic['finished'] + userDic['unfinished']
    userDic['doubtNo'] = len(EntityNew.objects.filter(check_name=userName, doubt=1))
    allItem = []
    itemDic = {}
    for entity in finished:
        itemDic = {}
        itemDic['eid'] = entity.EID
        itemDic['name'] = entity.EID.split('.')[-1]
        itemDic['isFinished'] = 1
        allItem.append(itemDic)
    for entity in unfinished:
        itemDic = {}
        itemDic['eid'] = entity.EID
        itemDic['name'] = entity.EID.split('.')[-1]
        itemDic['isFinished'] = 0
        allItem.append(itemDic)
    userDic['allItem'] = allItem
    result = {"userInfo": [userDic]}

    return HttpResponse(json.dumps(result, default={}, ensure_ascii=False),
                        content_type='application/json')


def getPropList(EID):
    result = {}

    oldProps = PropertyData.objects.filter(EID=EID, objid=None)

    for prop in oldProps:

        if prop.PROPID in result:
            result[prop.PROPID] += prop.origin + '\n'
        else:
            result[prop.PROPID] = prop.origin + '\n'
        getSingleProp(prop, EID, prop.PROPID, result)
        result[prop.PROPID] += '\n'
    return result


def getSingleProp(prop: PropertyData, EID, propID, p_list, layer=1):

    if is_number(prop.prop_value):
        subProps = PropertyData.objects.filter(EID=EID, objid=prop.prop_value)

        if layer > 1:
            p_list[propID] += prop.PROPID.split('.')[-1] + '\n'
        for subProp in subProps:
            getSingleProp(subProp, EID, propID, p_list, layer + 1)

    else:
        if layer == 1:
            p_list[propID] += prop.prop_value + '\n'
        else:
            p_list[propID] += prop.PROPID.split('.')[-1] + '\n' + prop.prop_value + '\n'


def getPropListNew(EID):
    result = {}
    newProps = PropertyDataNew.objects.filter(EID=EID, objid=None)

    for prop in newProps:
        propName = prop.PROPID.split('.')[-1]

        if prop.PROPID in result:
            # result[prop.PROPID].append(getSinglePropNew(EID, prop.prop_value))
            temp = getSinglePropNew(EID, prop.prop_value)
            result[prop.PROPID].append( [ temp[item] if item in temp else '' for item in listType[propName]] )
        else:
            if is_number(prop.prop_value):
                if prop.PROPID.split('.')[-1] in listType:
                    temp = getSinglePropNew(EID, prop.prop_value)
                    result[prop.PROPID]= [[temp[item] if item in temp else '' for item in listType[propName]]]
                    # result[prop.PROPID] = [getSinglePropNew(EID, prop.prop_value)]
                else:
                    result[prop.PROPID] = getSinglePropNew(EID, prop.prop_value)
            else:
                result[prop.PROPID] = prop.prop_value

    return result


def getSinglePropNew(EID, objid):
    result = {}
    subProps = PropertyDataNew.objects.filter(EID=EID, objid=objid)
    for subProp in subProps:
        subPropName = subProp.PROPID.split('.')[-1]
        if is_number(subProp.prop_value):
            result[subPropName] = getSinglePropNew(EID, subProp.prop_value)
        else:
            result[subPropName] = subProp.prop_value

    return result


def bussiness2(request):
    global prop_list, prop_list_new

    userName = request.session.get('username_check')

    EID = request.session.get('eid')
    if EID is None:
        EID = Entity.objects.filter(check_name=userName, check=0)[0].EID
        request.session['eid'] = EID
    prop_list = getPropList(EID)
    prop_list_new = getPropListNew(EID)

    result = genDefJson(EID)

    return HttpResponse(json.dumps(result, default={}, ensure_ascii=False),
                        content_type='application/json')


def test2(request):
    # result = getAllPropDataDic('lkai.ent.低密度脂蛋白胆固醇', 'lkai.prop.结果解读')
    #result = genDefJson('lkai.ent.低密度脂蛋白胆固醇')
    result = getPropListNew('lkai.ent.骨髓各系细胞形态学检查')
    # result = PropertyData.objects.filter(EID='lkai.ent.可的松水试验',PROPID='lkai.prop.结果解读')

    return HttpResponse(json.dumps(result, default={}, ensure_ascii=False),
                        content_type='application/json')


# def test(request):
#     template_data = {'tabNames': ["名称", "指标信息", "指标意义", "检查须知", "实验室相关"]}
#     result = genDefJson('lkai.ent.低密度脂蛋白胆固醇')
#     template_data['defs'] = [result['DEF_1'],result['DEF_2'],result['DEF_3'],result['DEF_4'],result['DEF_5']]
#     return render(request, 'index_templates.html', template_data)


def genDefJson(EID):
    result = {'EID': EID, 'name': EID.split('.')[-1],
              'DEF_1': [], 'DEF_2': [], 'DEF_3': [], 'DEF_4': [], 'DEF_5': [], }

    # 属性分为5组，分组信息在tag_list中
    for index, tags in enumerate(tag_list):
        listName = 'DEF_' + str(index + 1)
        for tag in tags:
            # 每个属性对应一个字典
            propDic = {'propid': tag, 'name': tag.split('.')[-1]}
            # 可选类型
            if propDic['name'] in enumPropDic:
                propDic['type'] = 'select'
                propDic['enum_list'] = enumPropDic[propDic['name']]
            #
            elif propDic['name'] in listType:
                propDic['type'] = 'list'
                num = len(PropertyDataNew.objects.filter(EID=EID, PROPID=tag))
                if num == 0:
                    propDic['num'] = 1
                else:
                    propDic['num'] = num
            # 组合类型
            elif propDic['name'] in objectType:
                propDic['type'] = 'object'
                propDic['fields'] = objectType[propDic['name']]
            # 字符串类型
            else:
                propDic['type'] = 'string'

            result[listName].append(propDic)
    return result


# 生成完整的json，包含所有属性的结构
# 除object类型属性的结构外，其他属性
# def genDefJson(EID):
#     result = {'EID': EID, 'name': EID.split('.')[-1],
#               'DEF_1': [], 'DEF_2': [], 'DEF_3': [], 'DEF_4': [], 'DEF_5': [], }
#
#     # 属性分为5组，分组信息在tag_list中
#     for index, tags in enumerate(tag_list):
#         listName = 'DEF_' + str(index + 1)
#         for tag in tags:
#             # 每个属性对应一个字典
#             propDic = {'propid': tag, 'name': tag.split('.')[-1]}
#             # 可选类型
#             if propDic['name'] in enumPropDic:
#                 propDic['type'] = 'select'
#                 propDic['enum_list'] = enumPropDic[propDic['name']]
#             # 前端要求
#             elif propDic['name'] in tagPropDic:
#                 propDic['type'] = 'tag'
#             # 组合类型
#             elif propDic['name'] in objectType:
#                 propDic['type'] = 'object'
#                 prop = PropertyData.objects.filter(EID=EID, PROPID=propDic['propid'])
#                 fields = []
#                 for item in objectType[propDic['name']]:
#                     fields.append({'propid': ('lkai.prop.' + item), 'name': item, 'type': 'string'})
#                 propDic['fields_new'] = fields
#                 if len(prop) > 0:
#                     propDic['fields_old'] = getPropDefDic(prop[0])['fields']
#                 else:
#                     propDic['fields_old'] = fields
#             # 字符串类型
#             else:
#                 propDic['type'] = 'string'
#
#             result[listName].append(propDic)
#     return result


# def getPropDefDic(prop: PropertyData):
#     definition = {'propid': prop.PROPID,
#                   'name': prop.PROPID.split('.')[-1], }
#     # 属性的类型判断
#     #   可选类型，对应下拉框
#     if definition['name'] in enumPropDic:
#         definition['type'] = 'select'
#         definition['enum'] = enumPropDic[definition['name']]
#     else:
#         subProps = PropertyData.objects.filter(objid=prop.prop_value)
#         # 复合类型，对应有子属性
#         if len(subProps) > 0:
#             definition['type'] = 'object'
#             subDef = [getPropDefDic(subProp) for subProp in subProps]
#             definition['fields'] = subDef
#         # 字符串类型
#         else:
#             definition['type'] = 'string'
#
#     return definition


def check_login(f):
    @wraps(f)
    def inner(request, *arg, **kwargs):
        if request.session.get('is_login') == '1':
            return f(request, *arg, **kwargs)
        else:
            return redirect('/login/')

    return inner


@check_login
def index(request):
    return render( request,"index.html")


def insert_quota(request):
    # with open("D:\\Code\\PythonCode\\LKAI\\db_deal\\data\\quota_name_8_13_1.txt", "r", encoding="utf8") as f:
    #     for item in f.readlines():
    #         print(item.strip())
    #         Entity.objects.create(EID=item.strip(), CPTID="lkai.检验指标", name=item.strip().split(".")[-1],
    #                               ownuser="mty_8_22")
    # return HttpResponse(request, "完成")
    EID = Entity.objects.filter(check_name="chenlu", check=False)[0]
    prop_list = PropertyData.objects.filter(EID=EID)
    for item in prop_list:
        print(item)
    return HttpResponse(request, "完成")


def f_search(request):
    q = request.GET['text']
    print(q)
    #
    re_contents = Entity.objects.filter(EID__contains=q, check_name=request.session.get("username_check"))
    re_json = []
    for re_content in re_contents:
        quota_name = re_content.EID.split(".")[-1]
        if quota_name not in re_json:
            re_json.append(quota_name)
    print(re_json)
    # return HttpResponse(json.dumps(re_json), content_type='application/json')
    return HttpResponse(",".join(re_json), content_type="application/string")


def data(request):
    return render(request, "index_admin.html")


data = staff_member_required(data)


# def get_value(objid_q, prop_list_q):
#     return_string = ""
#     for item1 in prop_list_q:
#         if item1.objid == objid_q:
#             if not is_number(item1.prop_value):
#                 return_string = return_string + "\n" + item1.origin + ":\n" + \
#                                 item1.PROPID.split(".")[-1] + "\n" + item1.prop_value + "\n"
#                 # print(return_string)
#             else:
#                 return_string = get_value(item1.prop_value, prop_list_q)
#     return return_string


def is_number(s):
    s = s[:-1]
    # print(s)
    try:
        float(s)
        return True
    except (TypeError, ValueError):
        pass
    try:
        import unicodedata
        unicodedata.numeric(s)
        return True
    except (TypeError, ValueError):
        pass
    return False


# def get_value(objid, prop_list_q): return_value = [] for item in prop_list_q: if item.objid == objid and not
# is_number(item.prop_value): return_value.append({"value": item.prop_value, "name": item.PROPID.split(".")[-1],
# "origin": item.origin}) elif item.objid == objid and is_number(item.prop_value): return_value.append({"name":
# item.PROPID.split(".")[-1], "value": get_value(item.prop_value, prop_list_q)}) return return_value
#
#
# def get_dic(prop_list_q):
#     return_dic = {}
#     for item in prop_list_q:
#         quota = str(item.PROPID).split(".")[-1]
#         print(return_dic)
#         if not is_number(item.prop_value) and not is_number(item.objid):
#             if quota not in return_dic:
#                 return_dic[quota] = [
#                     {"name": item.PROPID.split(".")[-1], "origin": item.origin, "value": item.prop_value}]
#             else:
#                 return_dic[quota] = return_dic[quota].append({"origin": item.origin, "value": item.prop_value})
#         elif is_number(item.prop_value) and not is_number(item.objid):
#             if quota not in return_dic:
#                 return_dic[quota] = [get_value(item.objid, prop_list_q)]
#             else:
#                 return_dic[quota] = return_dic[quota].append(get_value(item.objid, prop_list_q))
#     return return_dic

def concatenate(prop_list):
    """

    :type prop_list: 传进的参数是一个queryset
    """
    quota_model_list = []
    for item in prop_list:
        quota = Quota()
        quota.define(item)
        quota_model_list.append(quota)
    cache_dic = {}
    for item in quota_model_list:
        if is_number(item.value):
            cache_dic[item.value] = item
    idx = 0
    while idx < len(quota_model_list):
        item = quota_model_list[idx]
        if is_number(str(item.objid)):
            parent = cache_dic[item.objid]
            parent.children.append(quota_model_list.pop(idx))
            idx -= 1
        idx += 1
    list1 = []
    for item in quota_model_list:
        list1.append(item.to_string())
    return list1


def quota_to_json(quota):
    return {"name": quota.name, "value": quota.value, "origin": quota.origin, "children": quota.children}


def bussiness_search(request):
    global prop_list_new, quota_list_new
    user_name = request.session.get("username_check")
    # if request.GET("str") is "":
    #     return  HttpResponse(json.dumps(" "), content_type='application/json')
    print(request.GET.get("str"))
    EID = "lkai.ent." + request.GET.get("str")
    EID_NEW = EntityNew.objects.filter(EID=EID)
    # print(str(EID_NEW[0]))
    tag = False
    if EID_NEW.exists():
        tag = True
        prop_list_new = PropertyDataNew.objects.filter(EID=str(EID_NEW[0]))
        print(prop_list_new)
        quota_list_new = concatenate(prop_list_new)
    quota_name = str(EID).split(".")[-1]
    request.session['quota_name'] = quota_name
    prop_list = PropertyData.objects.filter(EID=EID)
    quota_list = concatenate(prop_list)

    # print(quota_list)
    # print(json.dumps(quota_list, default=quota_to_json, ensure_ascii=False))
    abbr = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.首字母缩写":
            abbr.append(item)

    aname = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.别称":
            aname.append(item)

    ename = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.英文名称":
            ename.append(item)

    eabbr = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.英文缩写":
            eabbr.append(item)

    redencode = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.大红本编码":
            redencode.append(item)

    dy = []

    for item in quota_list:
        if str(item['name']) == "lkai.prop.定义":
            dy.append(item)

    ksgl = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.科室归类":
            ksgl.append(item)

    rqhf = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.人群划分":
            rqhf.append(item)

    jcgl = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.检查归类":
            jcgl.append(item)

    sfkf = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.是否空腹":
            sfkf.append(item)

    ckjg = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.参考价格":
            ckjg.append(item)

    syrq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.适宜人群":
            syrq.append(item)

    bsyrq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.不适宜人群":
            bsyrq.append(item)

    hsjc = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.何时检测":
            hsjc.append(item)

    hdjc = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.何地检测":
            hdjc.append(item)

    cdsj = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.出单时间":
            cdsj.append(item)

    lcyy = []

    for item in quota_list:
        if str(item['name']) == "lkai.prop.临床意义":
            lcyy.append(item)

    ckfw = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.参考范围":
            ckfw.append(item)

    jgjd = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.结果解读":
            jgjd.append(item)

    xgjb = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.相关疾病":
            xgjb.append(item)

    xgzz = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.相关症状":
            xgzz.append(item)

    jyyzd = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.建议与指导":
            jyyzd.append(item)

    jcgc = []

    for item in quota_list:
        if str(item['name']) == "lkai.prop.检查过程":
            jcgc.append(item)

    jczysx = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.检查注意事项":
            jczysx.append(item)

    blfyyfx = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.不良反应与风险":
            blfyyfx.append(item)

    jcff = []

    for item in quota_list:
        if str(item['name']) == "lkai.prop.检测方法":
            jcff.append(item)

    ybyq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.样本要求":
            ybyq.append(item)

    cyyq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.采样要求":
            cyyq.append(item)

    bctj = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.保存条件":
            bctj.append(item)

    jsbz = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.拒收标准":
            jsbz.append(item)

    abbr_new = []
    aname_new = []
    ename_new = []
    eabbr_new = []
    redencode_new = []
    ksgl_new = []
    dy_new = []
    rqhf_new = []
    jcgl_new = []
    sfkf_new = []
    ckjg_new = []
    syrq_new = []
    bsyrq_new = []
    hsjc_new = []
    hdjc_new = []
    cdsj_new = []
    lcyy_new = []
    ckfw_new = []
    jgjd_new = []
    xgjb_new = []
    xgzz_new = []
    jyyzd_new = []
    jcgc_new = []
    jczysx_new = []
    blfyyfx_new = []
    jcff_new = []
    ybyq_new = []
    cyyq_new = []
    bctj_new = []
    jsbz_new = []
    doubt_new = []
    if tag:

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.首字母缩写":
                abbr_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(1)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.别称":
                aname_new.append(item)
                if item.doubt == 1:
                    # doubt_new.append("**")
                    doubt_new.append(2)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.英文名称":
                ename_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(3)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.英文缩写":
                eabbr_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(4)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.大红本编码":
                redencode_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(5)
        doubt_new.append("**")
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.定义":
                dy_new.append(item)

                if item.doubt == 1:
                    doubt_new.append(0)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.科室归类":
                ksgl_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(1)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.人群划分":
                rqhf_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(2)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检查归类":
                jcgl_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(3)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.是否空腹":
                sfkf_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(3)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.参考价格":
                ckjg_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(4)
        for item in quota_list:
            if str(item['name']) == "lkai.prop.适宜人群":
                syrq_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(5)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.不适宜人群":
                bsyrq_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(6)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.何时检测":
                hsjc_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(7)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.何地检测":
                hdjc_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(8)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.出单时间":
                cdsj_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(9)
        doubt_new.append("**")
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.临床意义":
                lcyy_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(0)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.参考范围":
                ckfw_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(1)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.结果解读":
                jgjd_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(2)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.相关疾病":
                xgjb_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.相关症状":
                xgzz_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(3)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.建议与指导":
                jyyzd_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(4)
        doubt_new.append("**")
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检查过程":
                jcgc_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(0)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检查注意事项":
                jczysx_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(1)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.不良反应与风险":
                blfyyfx_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(2)
        doubt_new.append("**")
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检测方法":
                jcff_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(0)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.样本要求":
                ybyq_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(1)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.采样要求":
                cyyq_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(2)
        for item in quota_list:
            if str(item['name']) == "lkai.prop.保存条件":
                bctj_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(3)
        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.拒收标准":
                jsbz_new.append(item)
                if item.doubt == 1:
                    doubt_new.append(4)
    else:
        pass
    finished = len(Entity.objects.filter(check_name=user_name, check=True))
    quota_all = len(Entity.objects.filter(check_name=user_name))
    # print(json.dumps(abbr))
    bussiness = {
        "userInfo": [
            {
                "username": user_name,
                "itemName": quota_name,
                "finished": finished,
                "unfinished": quota_all - finished,
                "all": quota_all,
                "doubtNo": "1"
            }],
        "name": [
            {
                "rname": {"prop_old": [
                    {"origin": "", "name": "lkai.prop.名称", "value": str(EID).split(".")[-1], "children": []}],
                    "prop_new": [{"origin": "", "name": "lkai.prop.名称", "value": str(EID).split(".")[-1],
                                  "children": []}]},
                "abbr": {"prop_old": abbr, "prop_new": abbr_new},
                "aname": {"prop_old": aname, "prop_new": aname_new},
                "ename": {"prop_old": ename, "prop_new": ename_new},
                "eabbr": {"prop_old": eabbr, "prop_new": eabbr_new},
                "redencode": {"prop_old": redencode, "prop_new": redencode_new},
                "doubt": "1,2,3"
            }],
        "itemInfo": [
            {
                "dy": {"prop_old": dy, "prop_new": dy_new},
                "ksgl": {"prop_old": ksgl, "prop_new": ksgl_new},
                "rqhf": {"prop_old": rqhf, "prop_new": rqhf_new},
                "jcgl": {"prop_old": jcgl, "prop_new": jcgl_new},
                "sfkf": {"prop_old": sfkf, "prop_new": sfkf_new},
                "ckjg": {"prop_old": ckjg, "prop_new": ckjg_new},
                "syrq": {"prop_old": syrq, "prop_new": syrq_new},
                "bsyrq": {"prop_old": bsyrq, "prop_new": bsyrq_new},
                "hsjc": {"prop_old": hsjc, "prop_new": hsjc_new},
                "hdjc": {"prop_old": hdjc, "prop_new": hdjc_new},
                "cdsj": {"prop_old": cdsj, "prop_new": cdsj_new},
                "doubt": "1,2,3,4"
            }],
        "itemmeanings": [
            {
                "lcyy": {"prop_old": lcyy, "prop_new": lcyy_new},
                "ckfw": {"prop_old": ckfw, "prop_new": ckfw_new},
                "jgjd": {"prop_old": jgjd, "prop_new": jgjd_new},
                "xgjb": {"prop_old": xgjb, "prop_new": xgjb_new},
                "xgzz": {"prop_old": xgzz, "prop_new": xgzz_new},
                "jyyzd": {"prop_old": jyyzd, "prop_new": jyyzd_new},
                "doubt": "1,2,3,5"
            }],
        "checkInfo": [
            {
                "jcgc": {"prop_old": jcgc, "prop_new": jcgc_new},
                "jczysx": {"prop_old": jczysx, "prop_new": jczysx_new},
                "blfyyfx": {"prop_old": blfyyfx, "prop_new": blfyyfx_new},
                "doubt": "1,2"
            }],
        "labInfo": [
            {
                "jcff": {"prop_old": jcff, "prop_new": jcff_new},
                "ybyq": {"prop_old": ybyq, "prop_new": ybyq_new},
                "cyyq": {"prop_old": cyyq, "prop_new": cyyq_new},
                "bctj": {"prop_old": bctj, "prop_new": bctj_new},
                "jsbz": {"prop_old": jsbz, "prop_new": jsbz_new},
                "doubt": "2,3"
            }]
    }
    # print(json.dumps(bussiness, default=quota_to_json, ensure_ascii=False, indent=2))
    return HttpResponse(json.dumps(bussiness, default=quota_to_json, ensure_ascii=False),
                        content_type='application/json')


def bussiness(request):
    # try:
    #     eid1 = "lkai.ent." + str(request.session.get("quota"))
    #     Entity.objects.filter(EID=eid1).update(check=True)
    # except:
    #     print("错误")
    global prop_list_new
    user_name = request.session.get("username_check")
    EID = Entity.objects.filter(check_name=user_name, check=False)[0]
    request.session['quota'] = str(EID).split(".")[-1]
    EID_NEW = EntityNew.objects.filter(EID=EID)

    # print(str(EID_NEW[0]))
    tag = False
    if EID_NEW.exists():
        tag = True
        prop_list_new = PropertyDataNew.objects.filter(EID=str(EID_NEW[0]))
        print(prop_list_new)
        quota_list_new = concatenate(prop_list_new)
    quota_name = str(EID).split(".")[-1]
    request.session['quota_name'] = quota_name
    prop_list = PropertyData.objects.filter(EID=EID)
    quota_list = concatenate(prop_list)

    # print(quota_list)
    # print(json.dumps(quota_list, default=quota_to_json, ensure_ascii=False))

    abbr = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.首字母缩写":
            abbr.append(item)
    aname = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.别称":
            aname.append(item)
    ename = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.英文名称":
            ename.append(item)
    eabbr = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.英文缩写":
            eabbr.append(item)
    redencode = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.大红本编码":
            redencode.append(item)
    dy = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.定义":
            dy.append(item)
    ksgl = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.科室归类":
            ksgl.append(item)
    rqhf = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.人群划分":
            rqhf.append(item)
    jcgl = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.检查归类":
            jcgl.append(item)
    sfkf = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.是否空腹":
            sfkf.append(item)
    ckjg = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.参考价格":
            ckjg.append(item)
    syrq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.适宜人群":
            syrq.append(item)
    bsyrq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.不适宜人群":
            bsyrq.append(item)
    hsjc = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.何时检测":
            hsjc.append(item)
    hdjc = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.何地检测":
            hdjc.append(item)
    cdsj = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.出单时间":
            cdsj.append(item)
    lcyy = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.临床意义":
            lcyy.append(item)
    ckfw = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.参考范围":
            ckfw.append(item)
    jgjd = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.结果解读":
            jgjd.append(item)
    xgjb = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.相关疾病":
            xgjb.append(item)
    xgzz = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.相关症状":
            xgzz.append(item)
    jyyzd = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.建议与指导":
            jyyzd.append(item)
    jcgc = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.检查过程":
            jcgc.append(item)
    jczysx = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.检查注意事项":
            jczysx.append(item)
    blfyyfx = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.不良反应与风险":
            blfyyfx.append(item)
    jcff = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.检测方法":
            jcff.append(item)
    ybyq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.样本要求":
            ybyq.append(item)
    cyyq = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.采样要求":
            cyyq.append(item)
    bctj = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.保存条件":
            bctj.append(item)
    jsbz = []
    for item in quota_list:
        if str(item['name']) == "lkai.prop.拒收标准":
            jsbz.append(item)
    abbr_new = []
    aname_new = []
    ename_new = []
    eabbr_new = []
    redencode_new = []
    ksgl_new = []
    dy_new = []
    rqhf_new = []
    jcgl_new = []
    sfkf_new = []
    ckjg_new = []
    syrq_new = []
    bsyrq_new = []
    hsjc_new = []
    hdjc_new = []
    cdsj_new = []
    lcyy_new = []
    ckfw_new = []
    jgjd_new = []
    xgjb_new = []
    xgzz_new = []
    jyyzd_new = []
    jcgc_new = []
    jczysx_new = []
    blfyyfx_new = []
    jcff_new = []
    ybyq_new = []
    cyyq_new = []
    bctj_new = []
    jsbz_new = []
    doubt_new = []
    if tag:

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.首字母缩写":
                abbr_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.别称":
                aname_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.英文名称":
                ename_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.英文缩写":
                eabbr_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.大红本编码":
                redencode_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.定义":
                dy_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.科室归类":
                ksgl_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.人群划分":
                rqhf_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检查归类":
                jcgl_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.是否空腹":
                sfkf_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.参考价格":
                ckjg_new.append(item)

        for item in quota_list:
            if str(item['name']) == "lkai.prop.适宜人群":
                syrq_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.不适宜人群":
                bsyrq_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.何时检测":
                hsjc_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.何地检测":
                hdjc_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.出单时间":
                cdsj_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.临床意义":
                lcyy_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.参考范围":
                ckfw_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.结果解读":
                jgjd_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.相关疾病":
                xgjb_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.相关症状":
                xgzz_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.建议与指导":
                jyyzd_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检查过程":
                jcgc_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检查注意事项":
                jczysx_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.不良反应与风险":
                blfyyfx_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.检测方法":
                jcff_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.样本要求":
                ybyq_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.采样要求":
                cyyq_new.append(item)

        for item in quota_list:
            if str(item['name']) == "lkai.prop.保存条件":
                bctj_new.append(item)

        for item in quota_list_new:
            if str(item['name']) == "lkai.prop.拒收标准":
                jsbz_new.append(item)
    else:
        pass
    finished = len(Entity.objects.filter(check_name=user_name, check=True))
    quota_all = len(Entity.objects.filter(check_name=user_name))
    # print(json.dumps(abbr))
    if doubt_new == []:
        doubt0 = ""
        doubt1 = ""
        doubt2 = ""
        doubt3 = ""
        doubt4 = ""
        # doubt_num = 0
    else:
        doubt = ",".join(doubt_new)
        doubt0, doubt1, doubt2, doubt3, doubt4 = doubt.split(",**,")
    doubt_num = len(EntityNew.objects.filter(doubt=1, check_name=user_name))

    bussiness = {
        "userInfo": [
            {
                "username": user_name,
                "itemName": quota_name,
                "finished": finished,
                "unfinished": quota_all - finished,
                "all": quota_all,
                "doubtNo": doubt_num
            }],
        "name": [
            {
                "rname": {"prop_old": [
                    {"origin": "", "name": "lkai.prop.名称", "value": str(EID).split(".")[-1], "children": []}],
                    "prop_new": [{"origin": "", "name": "lkai.prop.名称", "value": str(EID).split(".")[-1],
                                  "children": []}]},
                "abbr": {"prop_old": abbr, "prop_new": abbr_new},
                "aname": {"prop_old": aname, "prop_new": aname_new},
                "ename": {"prop_old": ename, "prop_new": ename_new},
                "eabbr": {"prop_old": eabbr, "prop_new": eabbr_new},
                "redencode": {"prop_old": redencode, "prop_new": redencode_new},
                "doubt": doubt0
            }],
        "itemInfo": [
            {
                "dy": {"prop_old": dy, "prop_new": dy_new},
                "ksgl": {"prop_old": ksgl, "prop_new": ksgl_new},
                "rqhf": {"prop_old": rqhf, "prop_new": rqhf_new},
                "jcgl": {"prop_old": jcgl, "prop_new": jcgl_new},
                "sfkf": {"prop_old": sfkf, "prop_new": sfkf_new},
                "ckjg": {"prop_old": ckjg, "prop_new": ckjg_new},
                "syrq": {"prop_old": syrq, "prop_new": syrq_new},
                "bsyrq": {"prop_old": bsyrq, "prop_new": bsyrq_new},
                "hsjc": {"prop_old": hsjc, "prop_new": hsjc_new},
                "hdjc": {"prop_old": hdjc, "prop_new": hdjc_new},
                "cdsj": {"prop_old": cdsj, "prop_new": cdsj_new},
                "doubt": doubt1
            }],
        "itemmeanings": [
            {
                "lcyy": {"prop_old": lcyy, "prop_new": lcyy_new},
                "ckfw": {"prop_old": ckfw, "prop_new": ckfw_new},
                "jgjd": {"prop_old": jgjd, "prop_new": jgjd_new},
                "xgjb": {"prop_old": xgjb, "prop_new": xgjb_new},
                "xgzz": {"prop_old": xgzz, "prop_new": xgzz_new},
                "jyyzd": {"prop_old": jyyzd, "prop_new": jyyzd_new},
                "doubt": doubt2
            }],
        "checkInfo": [
            {
                "jcgc": {"prop_old": jcgc, "prop_new": jcgc_new},
                "jczysx": {"prop_old": jczysx, "prop_new": jczysx_new},
                "blfyyfx": {"prop_old": blfyyfx, "prop_new": blfyyfx_new},
                "doubt": doubt3
            }],
        "labInfo": [
            {
                "jcff": {"prop_old": jcff, "prop_new": jcff_new},
                "ybyq": {"prop_old": ybyq, "prop_new": ybyq_new},
                "cyyq": {"prop_old": cyyq, "prop_new": cyyq_new},
                "bctj": {"prop_old": bctj, "prop_new": bctj_new},
                "jsbz": {"prop_old": jsbz, "prop_new": jsbz_new},
                "doubt": doubt4
            }]
    }
    # print(json.dumps(bussiness, default=quota_to_json, ensure_ascii=False, indent=2))
    return HttpResponse(json.dumps(bussiness, default=quota_to_json, ensure_ascii=False),
                        content_type='application/json')


def insert(request):
    if request.is_ajax():
        num = int(request.GET.get('num'))
        print(num)
        print(request.POST)
        checkbox_name = "checkbox" + str(num)
        data_list = request.POST.getlist("texta", "")
        checkbox_list = request.POST.getlist(checkbox_name, "")
        print(data_list)
        print(checkbox_list)
        quota_name = request.session.get("quota_name")
        name = request.session.get("username_check")
        num1 = 0

        for index_, item in enumerate(tag_list[num]):

            # print(index_, item)
            # print(data_list[index_])
            if data_list[index_] != "暂无数据":
                if str(index_) in checkbox_list:
                    PropertyDataNew.objects.update_or_create \
                        (EID="lkai.ent." + str(quota_name), PROPID=item, prop_value=data_list[index_], doubt=True,
                         ownuser=name)
                else:

                    PropertyDataNew.objects.update_or_create \
                        (EID="lkai.ent." + str(quota_name), PROPID=item, prop_value=data_list[index_], doubt=False,
                         ownuser=name)
        content = PropertyDataNew.objects.filter(EID="lkai.ent." + quota_name)
        for item in content:
            if item.doubt == 1:
                num1 = 1
                break
        if num1 == 0:
            doubt = False
        else:
            doubt = True
        EntityNew.objects.update_or_create(EID="lkai.ent." + quota_name, CPTID="lkai.检验指标", name=quota_name,
                                           ownuser=name, check_name=name, doubt=doubt)
    return JsonResponse({'status': 200})


#
def login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = User.objects.filter(name=username, password=password)
        if user:
            request.session.clear()
            request.session['is_login'] = '1'
            request.session['username_check'] = username

            return redirect('/index/')
    return render(request, 'login.html')

# def getAllPropDataDic(EID, PROPID,tag):
#     props = PropertyData.objects.filter(EID=EID, PROPID=PROPID)
#     print(props)
#     result = {}
#
#     if tag == 'old':
#         for prop in props:
#             source = prop.origin
#             if source == 'None':
#                 source = PropertyData.objects.filter(EID=EID, objid=prop.prop_value)[0].origin
#             result[source] = getSinglePropDataDic(prop)
#
#     elif tag == 'new':
#         newProps = PropertyDataNew.objects.filter(EID=EID, PROPID=PROPID)
#
#         if len(newProps) ==1:
#             result = getSinglePropDataDic(newProps[0])
#         elif len(newProps) > 1:
#             print('新表中同一指标下同一属性超过1个')
#
#     return result
#
#
# def getSinglePropDataDic(prop):
#     data = {'EPID': prop.EPID, 'propid': prop.PROPID, 'name': '', 'objid': prop.objid, 'type': '', 'value': ''}
#     name = data['propid'].split('.')[-1]
#     data['name'] = name
#     # 属性的类型判断
#     # 可选类型，对应下拉框
#     if name in enumPropDic:
#             data['type'] = 'select'
#             data['value'] = prop.prop_value
#     # 复合类型，对应有子属性
#     elif name in['结果解读', ]:
#             data['type'] = 'object'
#             subPropList = PropertyData.objects.filter(objid=prop.prop_value)
#             subData = [getSinglePropDataDic(subProp) for subProp in subPropList]
#             data['value'] = subData
#     # 字符串类型
#     else:
#             data['type'] = 'string'
#             data['value'] = prop.prop_value
#
#     return data
