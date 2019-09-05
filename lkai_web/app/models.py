# coding:utf8
from django.db import models


# Create your models here.
# 实体属性表的模型类
class PropertyData(models.Model):
    EPID = models.BigAutoField(primary_key=True)
    EID = models.CharField(max_length=255)
    PROPID = models.CharField(max_length=255)
    objid = models.CharField(max_length=255, null=True)
    prop_value = models.TextField()
    origin = models.CharField(max_length=50, null=True)
    ownuser = models.CharField(max_length=50, null=True)
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_dat_instance_property_info"

    def __str__(self):
        return self.PROPID


# 新的实体属性表的模型类
class PropertyDataNew(models.Model):
    EPID = models.BigAutoField(primary_key=True)
    EID = models.CharField(max_length=255)
    PROPID = models.CharField(max_length=255)
    objid = models.CharField(max_length=255, null=True)
    prop_value = models.TextField()
    origin = models.CharField(max_length=50, null=True)
    ownuser = models.CharField(max_length=50, null=True)
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    doubt = models.BooleanField(default=False)

    class Meta:
        db_table = "t_dat_instance_property_info_new"

    def __str__(self):
        return self.prop_value


# 实体类
class Entity(models.Model):
    EID = models.CharField(max_length=100)
    CPTID = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    icon = models.ImageField()
    ownuser = models.CharField(max_length=50, null=True)
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    check_name = models.CharField(max_length=255, null=True)
    check = models.BooleanField(default=False)

    class Meta:
        db_table = "t_dat_instance_info"

    def __str__(self):
        return self.EID


# 新表的实体类
class EntityNew(models.Model):
    EID = models.CharField(max_length=100)
    CPTID = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    icon = models.ImageField()
    ownuser = models.CharField(max_length=50, null=True)
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)
    check_name = models.CharField(max_length=255, null=True)
    doubt = models.BooleanField(default=False)

    class Meta:
        db_table = "t_dat_instance_info_new"

    def __str__(self):
        return self.EID


# 关系类
class Relation(models.Model):
    ERID = models.BigAutoField(primary_key=True)
    EID_SUBJECT = models.CharField(max_length=100)
    RID = models.CharField(max_length=255)
    EID_OBJECT = models.CharField(max_length=100)
    reversible = models.BooleanField(default=False)
    ownuser = models.CharField(max_length=100, null=True)
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_dat_instance_relation_info"


# 实体与属性的关联定义，用于存储哪些实体具有哪些属性。如：检验指标所具有的的三十余属性
class EntityToProp(models.Model):
    CPID = models.BigAutoField(primary_key=True)
    CPTID = models.CharField(max_length=100)
    PROPID = models.CharField(max_length=100)
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_def_concept_property"


# 属性定义表，用于定义所有的属性名
class PropDefault(models.Model):
    PROPID = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    sortid = models.IntegerField()
    icon = models.ImageField()
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_def_property_info"


# 属性的概念层次表
class PropConceptHierarchy(models.Model):
    HID = models.BigAutoField(primary_key=True)
    PROPID = models.CharField(max_length=255)  # 属性编号
    PID = models.CharField(max_length=255)  # 父类属性编号
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_def_property_hierarchy"


# 实体的概念层次表
class ConceptHierarchy(models.Model):
    HID = models.BigAutoField(primary_key=True)
    CPTID = models.CharField(max_length=255)  # 概念编号
    PID = models.CharField(max_length=255)  # 父类概念编号
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_def_concept_hierarchy"


# 概念定义表
class Concept(models.Model):
    CPID = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    icon = models.ImageField()
    insert_time = models.DateTimeField(auto_now_add=True)
    update_time = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "t_def_concept_info"


class User(models.Model):
    name = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)


class AdminName(models.Model):
    name = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
