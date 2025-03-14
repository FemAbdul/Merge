# Generated by Django 5.1.2 on 2025-01-09 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_userprofile_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='last_seen',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='online_status',
            field=models.CharField(choices=[('online', 'Online'), ('offline', 'Offline')], default='offline', max_length=10),
        ),
    ]
