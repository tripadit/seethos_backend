"""
URL configuration for dualityAI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path, include, re_path
from django.http import JsonResponse
from django.conf import settings
from drf_yasg.views import get_schema_view
from django.conf.urls.static import static
from rest_framework import permissions 
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from accounts.views import AccountViewSet

schema_view = get_schema_view(
    openapi.Info(
        title="Seethos API",
        default_version='v1',
        description="API documentation for Seethos",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@seethos.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

from rest_framework import permissions, routers
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView,
)
from subscription.views import SubscriberViewSet , BillingAddressViewSet
from accounts.views import AccountViewSet
from chatbot.views import ChatbotViewSet , FileViewSet , ConversionViewset , AvatarViewset , SitemapViewset , ReviewViewset , AvatarImageViewset
from chatbot.new_views import create_a_bot


router = routers.DefaultRouter()
router.register(r'chatbot', ChatbotViewSet, basename='chatbot')
router.register(r'account', AccountViewSet)
router.register(r'subscribe', SubscriberViewSet)
router.register(r'file', FileViewSet)
router.register(r'billing-address', BillingAddressViewSet)
router.register(r'conversion', ConversionViewset)
router.register(r'bot_info', AvatarViewset, basename='bot-info')
router.register(r'sitemap', SitemapViewset)
router.register(r'review', ReviewViewset)
router.register(r'avatar-image', AvatarImageViewset)


urlpatterns = [
                  # API
                  # url('api_admin/', site.urls),
                  re_path('^api/v1/email-campaign/get_notifications/', lambda request: JsonResponse([], safe=False)),
                  re_path('^api/v1/', include(router.urls)),
                  re_path('admin/', admin.site.urls),
                  re_path(r'^docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
                  re_path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
                  path('create_a_bot', create_a_bot, name='create_a_bot'),
                  path('api/v1/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('dj-rest-auth/google/', include('dj_rest_auth.registration.urls')),
                  # path(r'^tinymce/', include('tinymce.urls')),
              ] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

schema_view = get_schema_view(
    openapi.Info(
        title="seethos AI API",
        default_version='v1',
    ),
    url=f'{settings.BASE_URL}',
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# if not settings.PRODUCTION and not settings.TESTING:
urlpatterns.insert(
    2,
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json')
)
urlpatterns.insert(3, re_path('swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'))
urlpatterns.insert(4, re_path('^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'))

# if not settings.PRODUCTION and not settings.TESTING:

admin.site.site_header = "Seethos AI Admin Dashboard"
admin.site.site_title = "Seethos Admin Dashboard"
admin.site.index_title = "Seethos Admin Dashboard"
