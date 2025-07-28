from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.throttling import ScopedRateThrottle
from .models import Chatbot , File , Sitemap , Review , AvatarImages
from .serializers import ChatbotSerializer , FileSerializer , ChatbotViewSerializer , AdminChatbotSerializer , SitemapSerializer , ReviewSerializer ,BasicReviewSerializer ,GenerateAsistantNameSerializer , AvatarImageSerializer
from helpers.viewsets import BaseViewSet , BaseAuthViewSet , subscription_limit
from .utils import create_chat_bot , update_chat_bot , delete_chat_bot , analyze_conversation , analyze_session ,analyze_all_session
from rest_framework.decorators import action
from rest_framework.response import Response
from helpers.mongodb_client_data import get_chatbot_session_by_id , get_chatbot , get_ids_and_info_lengths , get_details_by_id , count_active_conversion , count_session ,count_chatbot , update_conversion, get_all_lead , progression_status ,progression_status_active,delete_session,get_progression_data , get_peak_hours , get_query_count, get_query_count_by_chatbot,get_all_chatbot_session
from rest_framework import status
from django.http import HttpResponseRedirect
from rest_framework import filters as filter
from django.db.models import Q
from accounts.models import Account
import datetime
import asyncio
from asgiref.sync import async_to_sync
import requests
from django.http import HttpResponse
from helpers.openAI import generate_asistant_name
#import settings here
from django.conf import settings




class ChatbotViewSet(BaseAuthViewSet, ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView):
    # your existing code here
    queryset = Chatbot.objects.all()
    serializer_class = ChatbotViewSerializer
    filter_backends = [DjangoFilterBackend, filter.SearchFilter, OrderingFilter]
    throttle_classes = [ScopedRateThrottle]
    filter_fields = ['name', 'status', 'company_name']
    search_fields=['name']
    ordering = ('created_at',)

    #
    def get_serializer_class(self):
        # return ChatbotSerializer for create , update , delete
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return ChatbotSerializer
        
        if self.action == 'generate_asistant_name':
            return GenerateAsistantNameSerializer

        # return ChatbotViewSerializer for list , retrieve
        return ChatbotViewSerializer  
              

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Chatbot.objects.all()
        else:
            return Chatbot.objects.filter(account=user)
    
    #@subscription_limit(2)
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    #@subscription_limit(2)
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    #@subscription_limit(2)
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    #@subscription_limit(2)
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    def perform_destroy(self, instance):
        obj = self.get_object()

        if obj.account == self.request.user:
            instance.delete()
        else:
            return Response({"error": "You don't have permission to delete this object."}, status=status.HTTP_403_FORBIDDEN)

    def get_chatbot(self, request):
        user = self.request.user
        chatbot = Chatbot.objects.filter(account=user)
        serializer = ChatbotSerializer(chatbot, many=True)
        return Response(serializer.data)

    #function to create chatbot
    @action(detail=True, methods=['post'],url_path='deploy_chat_bot')
    def deploy_chat_bot(self,  request, pk=None):
        print(f"DEBUG: Entering deploy_chat_bot for pk={pk}")
        user = self.request.user
        print(f"DEBUG: User: {user.email}")
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        if not chatbot:
            print(f"DEBUG: Chatbot with ID {pk} not found for user {user.email}")
            return Response({"error": "You don't have permission to create this object."}, status=status.HTTP_403_FORBIDDEN)
        
        print(f"DEBUG: Chatbot found: {chatbot.name} (ID: {chatbot.id})")
        print(f"DEBUG: Current training status: {chatbot.traning_status}")

        #check if chatbot is already in training
        # if chatbot.traning_status == 'TRAINING':
        #     return Response({"message": "Chatbot is already in training"}, status=200)
        chatbot.traning_status = 'TRAINING'
        chatbot.save()
        print(f"DEBUG: Chatbot training status set to TRAINING")
        
        #get avatar url
        try:
            avatar_url = chatbot.avatar.url if chatbot.avatar else None
            print(f"DEBUG: Avatar URL: {avatar_url}")
        except Exception as e:
            avatar_url = None
            print(f"DEBUG: Error getting avatar URL: {e}")

        #get all file link of chatbot
        file = File.objects.filter(chatbot=chatbot).all()
        file_list = []
        for f in file:
            try:
                file_list.append((f.file.url,f.type))
            except Exception as e:
                print(f"DEBUG: Error getting file URL for file {f.name}: {e}")
        print(f"DEBUG: File list for Celery task: {file_list}")

        create_chat_bot.delay(chatbot.id,avatar_url,file_list)
        print(f"DEBUG: Celery task create_chat_bot triggered for chatbot ID: {chatbot.id}")
        return Response({"status":"TRAINING"}, status=200)

    #update chatbot
    @action(detail=True, methods=['post'], url_path='update_chat_bot')
    def update_chatbot(self, request, pk=None):
        user = self.request.user

        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        if not chatbot:
            return Response({"error": "You don't have permission to create this object."}, status=status.HTTP_403_FORBIDDEN)

        if chatbot.traning_status == 'TRAINING':
            return Response({"message": "Chatbot is already in training"}, status=200)

        chatbot.traning_status = 'TRAINING'
        chatbot.save()

        # ✅ Safely try to get avatar URL
        try:
            avatar_url = chatbot.avatar.url if chatbot.avatar else None
        except Exception as e:
            avatar_url = None
            print("⚠️ Failed to fetch avatar URL:", e)

        # ✅ Safely fetch file URLs
        file_list = []
        for f in File.objects.filter(chatbot=chatbot):
            try:
                file_list.append((f.file.url, f.type))
            except Exception as e:
                print("⚠️ Failed to fetch file URL for file:", f, "| Error:", e)

        # ✅ Kick off training (even if no avatar)
        create_chat_bot.delay(chatbot.id, avatar_url, file_list)

        return Response({"status": "TRAINING"}, status=200)

    @action(detail=True, methods=['post'],url_path='delete_chat_bot')
    def delete_chatbot(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()

        if chatbot:
        # use create_chat_bot function to create chatbot
            bot = delete_chat_bot(container_id=chatbot.container_id)
            try:
                chatbot.delete()
                return Response({"success": "Successfully deleted chatbot"}, status=200)
            except:
            #return fail to create chatbot
                return Response({"error": "Failed to delete chatbot"}, status=403)
        return Response({"error": "Failed to delete chatbot"}, status=403)   

    #function to get session by id and update conversion to true
    @action(detail=True, methods=['get'],url_path='update_conversion')
    def update_conversion(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        session_id = request.GET.get('session_id')
        try:
            update_conversion(chatbot.bot_id,session_id)
            return Response({"success": "Successfully updated conversion"}, status=200)
        except:
            #return fail to create chatbot
            return Response({"error": "Failed to update conversion"}, status=403)
        return Response({"error": "Failed to update conversion"}, status=403)

    #function to analyze a converstation extract answer of thses question
    @action(detail=True, methods=['get'],url_path='analyze_conversation')
    def analyze_conversation(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        session_id = request.GET.get('session_id')
        try:
            answer = analyze_conversation(chatbot,session_id)
            return Response(answer)
        except:
             #return fail to create chatbot
             return Response({"error": "Failed to analyze conversation"}, status=403)
        return Response({"error": "Failed to analyze conversation"}, status=403)

    #function to analyze session
    @action(detail=True, methods=['get'],url_path='analyze_session')
    def analyze_session(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(id=pk).first()
        session_id = request.GET.get('session_id')
        #try:
        answer = analyze_session(chatbot,session_id)
        return Response(answer)
        # except:
        #      #return fail to create chatbot
        #      return Response({"error": "Failed to analyze conversation"}, status=403)
        # return Response({"error": "Failed to analyze conversation"}, status=403)                

    @action(detail=True, methods=['get'],url_path='get_chatbot_info_by_id')
    def get_chatbot(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        
        try:
            chatbot_info = get_chatbot(chatbot.bot_id)
            print(chatbot_info)

            return Response(chatbot_info)
            
        except:
             #return fail to create chatbot
             return Response({"error": "Failed to fetch chatbot"}, status=400)
        return  Response({"error": "Failed to fetch chatbot"}, status=400)

    @action(detail=True, methods=['get'],url_path='get_all_session_by_chat_id')
    def get_chatbot_session_by_bot_id(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        #print(chatbot)
        try:
            chatbot_info = get_ids_and_info_lengths(chatbot.bot_id)
            print(chatbot_info)

            return Response(chatbot_info)
            
        except:
              #return fail to create chatbot
              return Response([], status=200)
        return  Response({"error": "Failed to fetch session"}, status=400)

    @action(detail=True, methods=['get'],url_path='get_session_info_by_id')
    def get_chatbot_session(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        session_id = request.GET.get('session_id')
        
        try:
            chatbot_info = get_details_by_id(chatbot.bot_id,session_id)
            return Response(chatbot_info)
            
        except:
            #return fail to create chatbot
            return Response({"error": "Failed to fetch chatbot"}, status=status.HTTP_403_FORBIDDEN)
        return  Response({"error": "Failed to fetch chatbot"}, status=status.HTTP_403_FORBIDDEN)

    #function to get all session
    @action(detail=False, methods=['get'],url_path='get_all_session')
    def get_all_session(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user).all()
        
        try:
            chatbot_info = get_all_chatbot_session(chatbot)
            return Response(chatbot_info)
            
        except:
             #return fail to create chatbot
             return Response([], status=200)
        return  Response({"error": "Failed to fetch chatbot"}, status=400)   

    #function to count session
    @action(detail=True, methods=['get'],url_path='count_session')
    def count_session(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        
        try:
            count = count_session(chatbot.bot_id)
            return Response(count)
            
        except:
            #return fail to create chatbot
            return Response({"error": "Failed to fetch chatbot"}, status=status.HTTP_403_FORBIDDEN)
        return  Response({"error": "Failed to fetch chatbot"}, status=status.HTTP_403_FORBIDDEN) 

    #function to count active session
    @action(detail=True, methods=['get'],url_path='count_active_session')
    def count_active_session(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user, id=pk).first()
        
        try:
            count = count_active_conversion(chatbot.bot_id)
            print(count)

            return Response(count)
            
        except:
             #return fail to create chatbot
             return Response({"error": "Failed to fetch chatbot"}, status=status.HTTP_403_FORBIDDEN)
        return  Response({"error": "Failed to fetch chatbot"}, status=status.HTTP_403_FORBIDDEN)

    #function to count chatbot
    @action(detail=False, methods=['get'],url_path='count_chatbot')
    def count_chatbot(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user).all()
        
        try:
            count = count_chatbot(chatbot)
            return Response(count)
            
        except:
             #return fail to create chatbot
             return Response({"total_chatbot":0,"total_session":0, "total_conversion":0,'active_chatbot':0,"time_to_conversion":0,"query_count":0,"query_count_month":0,"total_conversion_duration":0}, status=200)
        return  Response( {"total_chatbot":0,"total_session":0, "total_conversion":0,'active_chatbot':0,"time_to_conversion":0,"query_count":0,"query_count_month":0,"total_conversion_duration":0}, status=200)               

    #function to get all lead
    @action(detail=True, methods=['get'],url_path='get_all_lead')
    def get_all_lead(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(id=pk).first()
        try:
            analyze_all_session.delay(chatbot.bot_id,chatbot)
        except:
             pass
        try:
            lead = get_all_lead(chatbot.bot_id)
            return Response(lead)
            
        except:
             #return fail to create chatbot
             return Response([], status=status.HTTP_200_OK)
        return  Response({"error": "Failed to fetch Lead"}, status=status.HTTP_403_FORBIDDEN)


    @action(detail=False, methods=['get'],url_path='session_progression_status')
    def session_progression_status(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user).all()
        print(chatbot)
        #try:
        count = progression_status(chatbot)
        print(count)

        return Response(count) 

    @action(detail=False, methods=['get'],url_path='session_progression_conversion')
    def progression_status(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user).all()
        print(chatbot)
        #try:
        count = progression_status_active(chatbot)
        print(count)

        return Response(count)     

    #api to fetch progress of a chatbot
    @action(detail=False, methods=['get'],url_path='progression_status_all')  
    def progression_status_all(self,  request):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user).all()
        count = chatbot.count()
        
        #count all chatbot that was created until last month , last week , last day
        
        last_month = Chatbot.objects.filter(account=user,created_at__gte=datetime.datetime.utcnow() - datetime.timedelta(days=30)).count()
        last_week = Chatbot.objects.filter(account=user,created_at__gte=datetime.datetime.utcnow() - datetime.timedelta(days=7)).count()
        last_day = Chatbot.objects.filter(account=user,created_at__gte=datetime.datetime.utcnow() - datetime.timedelta(days=1)).count()

        #calculate percentage
        if last_month > 0:
            last_month = (count - last_month) / last_month * 100
        else:
            last_month = 0
        if last_week > 0:
            last_week = (count - last_week) / last_week * 100
        else:
            last_week = 0
        if last_day > 0:
            last_day = (count - last_day) / last_day * 100
        else:
            last_day = 0
        count = {"total_bots":chatbot.count(),"last_month":last_month,"last_week":last_week,"last_day":last_day}
        print(count)

        return Response(count)

    #progression status of a chatbot which is active 
    @action(detail=False, methods=['get'],url_path='progression_status_active')
    def progression_status_active(self,  request):     
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user,status=True).all()
        count = chatbot.count()
        
        #count all chatbot that was created until last month , last week , last day

        last_month = Chatbot.objects.filter(account=user,status=True,created_at__gte=datetime.datetime.utcnow() - datetime.timedelta(days=30)).count()
        last_week = Chatbot.objects.filter(account=user,status=True,created_at__gte=datetime.datetime.utcnow() - datetime.timedelta(days=7)).count()
        last_day = Chatbot.objects.filter(account=user,status=True,created_at__gte=datetime.datetime.utcnow() - datetime.timedelta(days=1)).count()

        #calculate percentage
        if last_month > 0:
            last_month = (count - last_month) / last_month * 100
        else:
            last_month = 0
        if last_week > 0:
            last_week = (count - last_week) / last_week * 100
        else:
            last_week = 0
        if last_day > 0:
            last_day = (count - last_day) / last_day * 100
        else:
            last_day = 0
        count = {"total_bots":chatbot.count(),"last_month":last_month,"last_week":last_week,"last_day":last_day}
        
        return Response(count)

    #function to delete session
    @action(detail=True, methods=['get'],url_path='delete_session')
    def delete_session(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(id=pk,account=user).first()
        session_id = request.GET.get('session_id')
        try:
            status =  delete_session(chatbot.bot_id,session_id)
            if status:
                return Response({"success": "Successfully deleted session"}, status=200)
        except:
            #return fail to create chatbot
            return Response({"error": "Failed to delete session"}, status=403)
        return Response({"error": "Failed to delete session"}, status=403) 

    #function to get progression data
    @action(detail=True, methods=['get'],url_path='get_progression_data')
    def get_progression_data(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(id=pk,account=user).first()
        try:
            data =  get_progression_data(chatbot.bot_id)
            return Response(data)
        except:
             #return fail to create chatbot
            return Response([], status=200)
        return Response({"error": "Failed to fetch progression data"}, status=403)   

    #function to get peak hours
    @action(detail=True, methods=['get'],url_path='get_peak_hours')
    def get_peak_hours(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(id=pk,account=user).first()
        try:
            data =  get_peak_hours(chatbot.bot_id)
            return Response(data)
        except:
             #return fail to create chatbot
             return Response({}, status=200)
        return Response({"error": "Failed to fetch peak hours"}, status=403)


    #function to get query count of all chatbot
    @action(detail=False, methods=['get'],url_path='get_query_count')
    def get_query_count(self,  request):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(account=user).all()
        if chatbot:
            try:
                data =  get_query_count(chatbot)
                return Response(data)
            except:
                #return fail to create chatbot
                return Response({"query_count": 0}, status=400)
        return Response({"query_count": 0}, status=200)

    #function to get query count of a chatbot
    @action(detail=True, methods=['get'],url_path='get_query_count_by_chatbot')
    def get_query_count_by_chatbot(self,  request, pk=None):
        user = self.request.user
        #get chatbot of user with id
        chatbot = Chatbot.objects.filter(id=pk,account=user).first()
        try:
            data =  get_query_count_by_chatbot(chatbot.bot_id)
            return Response(data)
        except:
             #return fail to create chatbot
             return Response({"error": "Failed to fetch query count"}, status=403)
        return Response({"error": "Failed to fetch query count"}, status=403)

    #function to generate assistant name
    @action(detail=False, methods=['post'],url_path='generate_asistant_name', permission_classes=[IsAuthenticated]) 
    def generate_asistant_name(self,  request):
        description = request.data.get('description','')
        business_name = request.data.get('business_name','')
        business_type = request.data.get('business_type','')
        gender = request.data.get('gender','')
        location = request.data.get('location','')

        try:
            name = generate_asistant_name(description,business_name,location,business_type,gender)
            return Response(name)
        except:
                #return fail to create chatbot
                return Response({"error": "Failed to generate assistant name"}, status=403)
                          

#fileupload viewset here
class FileViewSet(BaseAuthViewSet, ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    throttle_classes = [ScopedRateThrottle]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return File.objects.all()
        else:
            return File.objects.filter(account=user)
    #get_object
    def get_object(self):
        #check if user is superuser
        user = self.request.user
        if user.is_superuser:
            return super().get_object()
        elif self.kwargs.get('pk') in [290, 291]:
            return File.objects.filter(id=self.kwargs.get('pk')).first()    
        else:
            return File.objects.filter(account=user, id=self.kwargs.get('pk')).first()
    def perform_destroy(self, instance):
        obj = self.get_object()

        if obj.account == self.request.user:
            instance.delete()
        else:
            return Response({"error": "You don't have permission to delete this object."}, status=status.HTTP_403_FORBIDDEN)

    def get_file(self, request):
        user = self.request.user
        file = File.objects.filter(account=user)
        serializer = FileSerializer(file, many=True)
        return Response(serializer.data)


#create Admin chatbot viewset here
class AdminChatViewSet(BaseAuthViewSet,ListAPIView,CreateAPIView,RetrieveUpdateDestroyAPIView):
    queryset = Chatbot.objects.all()
    serializer_class = ChatbotViewSerializer
    
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    throttle_classes = [ScopedRateThrottle]

    #get serializer class
    def get_serializer_class(self):
        # return ChatbotSerializer for create , update , delete
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return AdminChatbotSerializer

        # return ChatbotViewSerializer for list , retrieve
        return AdminChatbotSerializer

    #get queryset
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Chatbot.objects.all()
        else:
            return Chatbot.objects.filter(account=user)

    #delete chatbot
    def perform_destroy(self, instance):
        obj = self.get_object()
        #check the superuser
        
        if obj.account == self.request.user:
            instance.delete()

        else:
            return Response({"error": "You don't have permission to delete this object."}, status=status.HTTP_403_FORBIDDEN)          
    
    

class ConversionViewset(BaseViewSet):
    queryset = Chatbot.objects.all()
    serializer_class = ChatbotViewSerializer
    
    #function to get session by id and update conversion to true
    @action(detail=False, methods=['get'],url_path='update_conversion')
    def update_conversion(self,  request):
        bot_id = request.GET.get('bot_id','')
        chatbot = Chatbot.objects.filter(bot_id=bot_id).first()
        print(chatbot)
        session_id = request.GET.get('session_id')
        print(session_id)
        if chatbot:
        
            #try:
                conversion= update_conversion(chatbot.bot_id,session_id)
                url = chatbot.call_to_action_link
                print(url)
                #redirect to url
                return HttpResponseRedirect(url)
            #except:
                #return fail to create chatbot
            #    return Response({"error": "Failed to update conversion"}, status=403)
        return Response({"error": "Failed to update conversion"}, status=403)

class AvatarViewset(BaseViewSet):
    queryset = Chatbot.objects.all()
    serializer_class = ChatbotViewSerializer
    

    #function to fetch avatar from chatbot
    @action(detail=False, methods=['get'],url_path='get_chatbot_info')
    def get_avatar(self,  request):
        bot_id = request.GET.get('bot_id','')
        if not bot_id:
            return Response({"error": "bot_id parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        chatbot = Chatbot.objects.filter(bot_id=bot_id).first()
        if not chatbot:
            return Response({"error": "Chatbot not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            avatar= chatbot.avatar
            if avatar:
                avatar = chatbot.avatar.url
            company_logo = chatbot.company_logo
            #check if company logo have file associated with it
            try:
                company_logo = chatbot.company_logo.url
            except:
                company_logo = None
            if company_logo:
                company_logo = chatbot.company_logo.url
            else:
                try:
                    company_logo = chatbot.account.company_logo.url
                except:
                    company_logo = None
            try:
                call_to_action_link = chatbot.call_to_action_link 
            except:
                call_to_action_link = None           
            company_name = chatbot.company_name
            greeting_tags = chatbot.greeting_tags
            greeting_message = chatbot.greeting_message
            theme = chatbot.theme
            name = chatbot.name
            #check if theme is null or empty set it to default
            if not theme:
                theme = 'dark'

            #bot_js_url = "https://newsletter-file.s3.amazonaws.com/chat.js"
            socket_domain = settings.SOCKET_DOMAIN
            socket_protocol = 'wss' if settings.DEBUG == False else 'ws'
            socket_url = f'{socket_protocol}://{socket_domain}/bws/{bot_id}' 
            landing_page_headline = chatbot.landing_page_headline
            landing_page_subheadline = chatbot.landing_page_subheadline
            #check if CtA button label is null or empty set it to default
            cta_button_label = chatbot.cta_button_label
            if not cta_button_label:
                cta_button_label = None   

            #redirect to url
            return Response({"avatar": avatar,"company_logo":company_logo,"company_name":company_name,'theme':theme,"call_to_action_link":call_to_action_link,"greeting_tags":greeting_tags,"greeting_message":greeting_message,"name":name, "socket_url":socket_url,"landing_page_headline":landing_page_headline,"landing_page_subheadline":landing_page_subheadline,'status':chatbot.status , 'cta_button_label':cta_button_label,"color":chatbot.color}, status=200)
        except Exception as e:
            # Log the exception for debugging purposes
            print(f"Error fetching chatbot info: {e}")
            return Response({"error": "Failed to fetch avatar due to internal error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    #function to fetch review from chatbot
    @action(detail=False, methods=['get'],url_path='get_review')
    def get_review(self,  request):
        bot_id = request.GET.get('bot_id','')
        chatbot = Chatbot.objects.filter(bot_id=bot_id).first()
        if chatbot:
        
            try:
                review= Review.objects.filter(chatbot=chatbot).all()
                review = BasicReviewSerializer(review,many=True).data
                #redirect to url
                return Response({"review": review}, status=200)
            except:
                #return fail to create chatbot
                return Response({"error": "Failed to fetch review"}, status=403)
        return Response({"error": "Failed to fetch review"}, status=403)
    
    #function to return js file
    @action(detail=False, methods=['get'],url_path='get_chatbot_js')
    def get_chatbot_js(self,  request):
        # js file is in s3 bucket
        bot_js_url = f"https://{settings.FRONTEND_DOMAIN}/bot/ai-assistant-component.js"
        #request js file
        js_data = requests.get(bot_js_url)
        #return js file
        return HttpResponse(js_data, content_type="application/javascript")


    
    @action(detail=False, methods=['get'],url_path='get_query_count_by_chatbot')
    def get_query_count_by_chatbot(self,  request):
        #user = self.request.user
        chatbot_id = request.GET.get('chatbot_id','')
        chatbot = Chatbot.objects.filter(bot_id=chatbot_id).first()
        if chatbot:
            try:
                user = chatbot.account
                chatbots = Chatbot.objects.filter(account=user).all()
                data =  get_query_count(chatbots)
                return Response(data)
            except:
                #return fail to create chatbot
                return Response({"error": "Failed to fetch query count"}, status=403)
        return Response({"error": "Failed to fetch query count"}, status=403)     
    

#viewset for sitemap
class SitemapViewset(BaseAuthViewSet, ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView):
    queryset = Sitemap.objects.all()
    serializer_class = SitemapSerializer
    
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    throttle_classes = [ScopedRateThrottle]
    filter_fields = ['url','chatbot']
    ordering = ('created_at',)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Sitemap.objects.all()
        else:
            return Sitemap.objects.filter(account=user)

    def perform_destroy(self, instance):
        obj = self.get_object()

        if obj.account == self.request.user:
            instance.delete()
        else:
            return Response({"error": "You don't have permission to delete this object."}, status=status.HTTP_403_FORBIDDEN)

    def get_sitemap(self, request):
        user = self.request.user
        sitemap = Sitemap.objects.filter(account=user)
        serializer = SitemapSerializer(sitemap, many=True)

        return Response(serializer.data)
    #get site map by chatbot id
    @action(detail=False, methods=['get'],url_path='get_sitemap_by_chatbot_id')
    def get_sitemap_by_chatbot_id(self,  request):
        user = self.request.user
        chatbot_id = request.GET.get('chatbot_id','')
        chatbot = Chatbot.objects.filter(id=chatbot_id).first()
        if chatbot:
            sitemap = Sitemap.objects.filter(chatbot=chatbot, account=user).order_by("-id")[:3]
            serializer = SitemapSerializer(sitemap, many=True)
            return Response(serializer.data)
        return Response({"error": "Failed to fetch sitemap"}, status=403) 
    

#viewset for Review
class ReviewViewset(BaseAuthViewSet, ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    throttle_classes = [ScopedRateThrottle]
    filter_fields = ['chatbot']
    ordering = ('created_at',)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Review.objects.all()
        else:
            return Review.objects.filter(account=user)

    def perform_destroy(self, instance):
        obj = self.get_object()

        if obj.account == self.request.user:
            instance.delete()
        else:
            return Response({"error": "You don't have permission to delete this object."}, status=status.HTTP_403_FORBIDDEN)

    def get_review(self, request):
        user = self.request.user
        review = Review.objects.filter(account=user)
        serializer = ReviewSerializer(review, many=True)

        return Response(serializer.data)

    #get review by chatbot id
    @action(detail=False, methods=['get'],url_path='get_review_by_chatbot_id')
    def get_review_by_chatbot_id(self,  request):
        user = self.request.user
        chatbot_id = request.GET.get('chatbot_id','')
        chatbot = Chatbot.objects.filter(id=chatbot_id).first()
        if chatbot:
            review = Review.objects.filter(chatbot=chatbot,account=user)
            serializer = ReviewSerializer(review, many=True)
            return Response(serializer.data)
        return Response({"error": "Failed to fetch review"}, status=403)
    
    #fetch all avatar image
    @action(detail=False, methods=['get'],url_path='get_avatar_image')
    def get_avatar_image(self,  request):
        user = self.request.user
        avatar = AvatarImages.objects.filter(is_active=False)
        serializer = AvatarImageSerializer(avatar, many=True)
        return Response(serializer.data)
    


#AvatarImage viewset here

class AvatarImageViewset(BaseAuthViewSet, ListAPIView):

    queryset = AvatarImages.objects.all()
    serializer_class = AvatarImageSerializer
    
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    throttle_classes = [ScopedRateThrottle]
    filter_fields = ['is_active']
    ordering = ('created_at',)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return AvatarImages.objects.all()
        else:
            return AvatarImages.objects.filter(chatbot = None)



    


  


          

  





