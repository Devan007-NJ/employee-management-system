from django.urls import path
from .auth_views import register,login
from .views import employee_list, employee_detail

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('list/', employee_list, name='employee_list'),
    path('<str:pk>/', employee_detail, name='employee_detail'),

]
