from django.urls import path
from . import views

urlpatterns = [
    path('signup/',views.signup,name='signup'),
    path('login/',views.login,name='login'),
    path('logout/',views.logout,name='logout'),
    path('addweight/',views.add_weight,name='addweight'),
    path('list/',views.list_weight,name='list'),
    path('listdelete/<int:pk>/',views.delete_weight,name='listdelete'),
    path('listupdate/<int:pk>/',views.update_weight,name='listupdate'),
    path('singleweight/<int:pk>/',views.get_weight,name='singleweight'),
    path('weightlose/',views.weight_difference_api,name='weightlose'),

   
   
]