import re

from django.conf import settings
from django.utils import timezone
from helpers.serializers import BaseSerializer
from rest_framework import serializers
from helpers.viewsets import get_tokens_for_user
from rest_framework.serializers import (
    BooleanField, CharField, SerializerMethodField, ValidationError,IntegerField,
)
from rest_framework.fields import CurrentUserDefault
from .models import Chatbot , File , Sitemap , Review , AvatarImages
from itertools import chain
from helpers.mongodb_client_data import count_session, count_active_conversion
from accounts.serializers import AccountBasicSerializer
from rest_framework.exceptions import ValidationError
from io import BytesIO
import PyPDF2
import openpyxl
from docx import Document
import requests
from .utils import get_data_from_url_scrape_api


#sitemap serilizers here
class SitemapSerializer(BaseSerializer):

    all_links = SerializerMethodField()
    class Meta:
        model = Sitemap
        fields = ('id','url','traning_links','chatbot','created_at','updated_at','all_links')

    def create(self, validated_data):
        # Retrieve the currently logged-in user
        user = self.context['request'].user
        sitemap = Sitemap.objects.create(**validated_data,account=user)
        return sitemap 

    def update(self, instance, validated_data):
        #check if the user is the owner of the chatbot
        user = self.context['request'].user
        if instance.account != user:
            raise ValidationError({"error": "You don't have permission to update this sitemap."})
        # Update the Chatbot instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance
    
    def get_all_links(self, obj):
        return get_data_from_url_scrape_api(obj.url)


#file serilizers here
class FileSerializer(BaseSerializer):
    class Meta:
        model = File
        fields = ('id','file','name','type','size','account','created_at','updated_at')


    #validate the file size and number of files
    def validate(self, data):
        # Retrieve the currently logged-in user
        user = self.context['request'].user
        #calculate the size of the file
        file_size = data.get('file').size
        if file_size > 10485760:
            #check if user is premium or pro
            if  user.subscription_type == 'LOW':
                raise ValidationError({"error": "File size is too large."})
        #count the number of files of user , if its more than 50 and user is not premium and pro then raise error
        if File.objects.filter(account=user).count() >= 100 and user.subscription_type == 'LOW':
            raise ValidationError({"error": "You have reached the maximum number of files."})    
        return data


    def create(self, validated_data):
        # Retrieve the currently logged-in user
        user = self.context['request'].user
        file = File.objects.create(account=user, **validated_data)
        return file 

    def update(self, instance, validated_data):
        #check if the user is the owner of the file
        user = self.context['request'].user
        if instance.account != user:
            raise ValidationError({"error": "You don't have permission to update this file."})
        # Update the File instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance

#chatbot serilizers here
class ChatbotSerializer(BaseSerializer):
    #add account field as current 
    account = AccountBasicSerializer(required=False)
    #add file field for list of files , the file can be list of files or single file
    files = serializers.ListField(child=serializers.IntegerField(),required=False)
    file = serializers.CharField(required=False)
    default_avatar = serializers.CharField(required=False)
    #avatar = SerializerMethodField()

    class Meta:
        model = Chatbot
        fields = ('id','name','greeting_message','company_name','status','greeting_tags','suggestive_tags','question','avatar','call_to_action_link','call_to_action_prompt','account','timezone','conversation_start_flow','conversation_end_flow','bot_id','files','file','sitemap_url','traning_links','company_logo','default_avatar','agent_role','landing_page_headline','landing_page_subheadline','cta_button_label','company_description','color','ideal_customer_profile','theme','location','custom_prompt')


    # #validate avatar as file or id of file
    # def validate_avatar(self, value):
    #     #check if it is a binary file
    #     if isinstance(value, bytes):
    #         return value
    #     #check if it is a id of file
    #     if isinstance(value, int):
    #         file = File.objects.get(id=value)
    #         #return file.file
    #         if file:
    #             return file.file
    #         else:
    #             raise ValidationError({"error": "File not found."})


    def create(self, validated_data):
        
        # Retrieve the currently logged-in user
        user = self.context['request'].user

        #check if user has chatbot already
        # if Chatbot.objects.filter(account=user).exists():
        #     raise ValidationError({"error": "You already have chatbot."})

        # Create the Chatbot instance, setting the account to the current user
        files = validated_data.pop('files', '')
        file = validated_data.pop('file', None)

        #check if avatar has file or it has id of file
        default_avatar = validated_data.pop('default_avatar', None)
        #avatar = validated_data.get('avatar', None)
        


                  
        chatbot = Chatbot.objects.create(account=user, **validated_data)

        if  default_avatar:
            try:
                    #unlink chatbot from avatar images
                    avatar = AvatarImages.objects.filter(id=default_avatar).first()
                    if avatar:
                        avatar.chatbot = chatbot
                        avatar.save()
                        chatbot.avatar = avatar.avatar
                        chatbot.save()
            except:
                    pass
            else:
                #add default avatar of id 290
                try:
                    avatar = AvatarImages.objects.filter(id=1).first()
                    chatbot.avatar = avatar.avatar
                    chatbot.save()
                except:
                    pass
        
        #get site map url and traning links
        #generate bot_id with random string of six characters and chatbot name
        chatbot.bot_id = ((chatbot.name.replace(" ", "") + str(chatbot.id)) if chatbot.name else "bot" + str(chatbot.id)).lower()
        chatbot.save()

        sitemap_url = validated_data.get('sitemap_url', None)
        traning_links = validated_data.get('traning_links', None)
        #check if sitemap url is not none and traning links is not none , if not none then get the data from url and save it in database sitemap model
        if sitemap_url and traning_links:
            #try: 
                #create sitemap model
                sitemap = Sitemap.objects.create(url=sitemap_url,traning_links=traning_links,chatbot=chatbot,account=user)
            #except:
            #    pass

        #check if the file is list of files , if file is list of files then  file for each file
        if files:
            #check if file is list of files
            if isinstance(files, list):
                for f in files:
                    #get file data
                    file_data = File.objects.get(id=f)
                    file_data.chatbot = chatbot
                    file_data.save()

            else:
                file_data = File.objects.get(id=file)
                file_data.chatbot = chatbot 
                file_data.save() 
        if file:
            file_data = File.objects.get(id=file)
            file_data.chatbot = chatbot 
            file_data.save()              

        return chatbot 

    def update(self, instance, validated_data):
        #check if the user is the owner of the chatbot
        default_avatar = validated_data.get('default_avatar', None)
        user = self.context['request'].user
        if instance.account != user:
            raise ValidationError({"error": "You don't have permission to update this chatbot."})
        
        file = validated_data.pop('files', None) 
        

          
        # Update the Chatbot instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)


        #check if avatar has file or it has id of file
        avatar = validated_data.get('avatar', None)
        if avatar:
            if isinstance(avatar, int):
                # try:
                #     avatar = File.objects.get(id=avatar)
                #     instance.avatar = avatar.file
                # except:
                #     pass
                try:
                    avatar = AvatarImages.objects.filter(id = avatar).first()
                    if avatar:
                        #remove chatbot from previous all avatar
                        try:
                            AvatarImages.objects.filter(chatbot=instance).update(chatbot=None) 
                        except:
                            pass
                        avatar.chatbot = instance
                        avatar.save()
                    instance.avatar = avatar.avatar
                except:
                    pass
            else:
                instance.avatar = avatar

        #get site map url and traning links
        sitemap_url = validated_data.get('sitemap_url', None)
        traning_links = validated_data.get('traning_links', None)
        #check if sitemap url is not none and traning links is not none , if not none then get the data from url and save it in database sitemap model
        if sitemap_url and traning_links:
            try: 
                #create sitemap model
                sitemap = Sitemap.objects.create(url=sitemap_url,traning_links=traning_links,chatbot=instance,account=user)
            except:
                pass    

        
        if file:
            #check if file is list of files
            if isinstance(file, list):
                for f in file:
                    #get file data
                    file_data = File.objects.get(id=f)

                    file_data.chatbot = instance
                    file_data.save()
            else:
                file_data = File.objects.get(id=file)
                file_data.chatbot = instance 
                file_data.save() 

        default_avatar=validated_data.pop('default_avatar', None)
        if default_avatar:
                # try:
                #     file_data = File.objects.get(id=default_avatar)
                #     validated_data['avatar'] = file_data.file
                # except:
                #     pass
                try:
                    #unlink chatbot from avatar images
                    file_data = AvatarImages.objects.filter(id=default_avatar).first()
                    #remove chatbot from previous all avatar
                    try:
                        AvatarImages.objects.filter(chatbot=instance).update(chatbot=None)
                    except:
                        pass
                    if file_data:
                        file_data.chatbot = instance
                        file_data.save()
                    
                    instance.avatar = file_data.avatar



                except:
                    pass        

        instance.save()


        return instance 

    def get_file(self, obj):
        
            files = File.objects.filter(chatbot=obj)
            return FileSerializer(files,many=True).data
    

class ChatbotViewSerializer(BaseSerializer):
    #add account field as current 
    account = AccountBasicSerializer(read_only=True)
    file = SerializerMethodField(required=False)
    session = SerializerMethodField()
    conversion = SerializerMethodField()
    company_logo = SerializerMethodField()
    bot_id = SerializerMethodField()
    class Meta:
        model = Chatbot
        fields = ('id','name','greeting_message','company_name','status','greeting_tags','suggestive_tags','question','avatar','call_to_action_link','call_to_action_prompt','account','timezone','conversation_start_flow','conversation_end_flow','bot_id','file','container_id','color','language','created_at','updated_at','session','conversion','sitemap_url','traning_links','company_logo','traning_status','agent_role','landing_page_headline','landing_page_subheadline' , 'cta_button_label','company_description','color','ideal_customer_profile','theme','location','custom_prompt')

    def get_session(self, obj):
        try:
            session = count_session(obj.bot_id)
            return session
        except:
            return 0

    def get_conversion(self, obj):
        try:
            conversion = count_active_conversion(obj.bot_id)
            return conversion
        except:
            return 0

    def get_file(self, obj):
        files = File.objects.filter(chatbot=obj)
        return FileSerializer(files,many=True).data

    def get_company_logo(self, obj):
        if obj.company_logo:
            return obj.company_logo.url
        else:
            try:
                return obj.account.company_logo.url
            except:
                return None

    def get_bot_id(self, obj):
        #check if bot id is none then generate bot id
        if obj.bot_id == None:
            return None
        else:
            return obj.bot_id





class AdminChatbotSerializer(BaseSerializer):
    #add account field as current 
    file = FileSerializer(required=False)
    class Meta:
        model = Chatbot
        fields = ('id','name','greeting_message','company_name','status','greeting_tags','suggestive_tags','question','avatar','call_to_action_link','call_to_action_prompt','account','timezone','conversation_start_flow','conversation_end_flow','bot_id','file','container_id','color','language','created_at','updated_at')

    def create(self, validated_data):
        # Retrieve the currently logged-in user

        #check if user has chatbot already
        # if Chatbot.objects.filter(account=user).exists():
        #     raise ValidationError({"error": "You already have chatbot."})

        # Create the Chatbot instance, setting the account to the current user
        file = validated_data.get('file', None)
        chatbot = Chatbot.objects.create(**validated_data)
        if file:
            chatbot.file = file
            chatbot.save()

        return chatbot

    def update(self, instance, validated_data):
        file = validated_data.get('file', None)    
        # Update the Chatbot instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        
        if file:
            instance.file = file    

        instance.save()

        return instance   

    #review serilizers here
class ReviewSerializer(BaseSerializer):
    class Meta:
        model = Review
        fields = ('id','name','title','review','rating','chatbot','created_at','updated_at','company','image')

        #validate if chatbot belons to user
    def validate_chatbot(self, value):
        # Retrieve the currently logged-in user
        user = self.context['request'].user
        #check if chatbot belongs to user
        if value.account != user:
            raise ValidationError({"error": "You don't have permission to add review to this chatbot."})
        return value


    def create(self, validated_data):
        # Retrieve the currently logged-in user
        user = self.context['request'].user
        review = Review.objects.create(account=user, **validated_data)
        return review 

    def update(self, instance, validated_data):
        #check if the user is the owner of the review
        user = self.context['request'].user
        if instance.account != user:
            raise ValidationError({"error": "You don't have permission to update this review."})
        # Update the Review instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance 
    
#basic review serilizers here
class BasicReviewSerializer(BaseSerializer):
    class Meta:
        model = Review
        fields = ('id','name','title','review','rating','chatbot','created_at','updated_at','company','image')


    def create(self, validated_data):
        # Retrieve the currently logged-in user
        user = self.context['request'].user
        review = Review.objects.create(account=user, **validated_data)
        return review 

    def update(self, instance, validated_data):
        #check if the user is the owner of the review
        user = self.context['request'].user
        if instance.account != user:
            raise ValidationError({"error": "You don't have permission to update this review."})
        # Update the Review instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        return instance    
    
#generate asistant name serilizers here
class GenerateAsistantNameSerializer(serializers.Serializer):
    description = CharField(required=False)
    business_name = CharField(required=False)
    location = CharField(required=False)
    business_type = CharField(required=False)
    gender = CharField(required=False)

#asistant avatra image serilizers here
class AvatarImageSerializer(BaseSerializer):
    class Meta:
        model = AvatarImages
        fields = ('id','avatar','chatbot','account','is_active','created_at','updated_at')


        