from django.urls import path
from .views import (
    WasteTypeListView, CenterListView, NearestCenterView,
    BookingCreateView, BookingListView, BookingDetailView,
    PaymentCreateView, PaymentVerifyView
)

urlpatterns = [
    path("types/", WasteTypeListView.as_view(), name="waste_types"),
    path("centers/", CenterListView.as_view(), name="centers"),
    path("centers/nearest/", NearestCenterView.as_view(), name="nearest_center"),
    path("booking/create/", BookingCreateView.as_view(), name="booking_create"),
    path("booking/history/", BookingListView.as_view(), name="booking_history"),
    path("booking/<int:pk>/", BookingDetailView.as_view(), name="booking_detail"),
    path("payment/create/", PaymentCreateView.as_view(), name="payment_create"),
    path("payment/verify/", PaymentVerifyView.as_view(), name="payment_verify"),
]
