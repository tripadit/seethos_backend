# Generated by Django 4.2.5 on 2023-10-03 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subscription', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subscription',
            name='subscription_type',
            field=models.CharField(choices=[('LOW', 'LOW'), ('MEDIUM', 'MEDIUM'), ('ADVANCED', 'ADVANCED')], max_length=10),
        ),
    ]
