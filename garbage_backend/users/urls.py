from django.urls import path
from .views import RegisterView, MeView, UpdateProfileView, ChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('me/', MeView.as_view(), name="me"),
    path('me/update/', UpdateProfileView.as_view(), name="update_profile"),
    path('change_password/', ChangePasswordView.as_view(), name="change_password"),
]