# Generated by Django 2.2.1 on 2019-08-19 05:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20190819_1336'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entity',
            name='ownuser',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='propertydata',
            name='objid',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='propertydata',
            name='origin',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='propertydata',
            name='ownuser',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='relation',
            name='ownuser',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
