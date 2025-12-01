from django.contrib import admin
from .models import WasteType, Center, Booking, Payment


@admin.register(WasteType)
class WasteTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_per_kg', 'description')
    search_fields = ('name',)


@admin.register(Center)
class CenterAdmin(admin.ModelAdmin):
    list_display = ('name', 'address', 'latitude', 'longitude', 'contact_info')
    search_fields = ('name', 'address')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'waste_type', 'quantity_kg', 'total_price', 'status', 'payment_status', 'pickup_date', 'created_at')
    list_filter = ('status', 'payment_status', 'pickup_date', 'created_at')
    search_fields = ('user__email', 'user__name', 'waste_type__name')
    readonly_fields = ('created_at', 'updated_at', 'total_price')
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Booking Details', {
            'fields': ('waste_type', 'quantity_kg', 'pickup_date', 'pickup_time', 'address', 'selected_center', 'waste_image')
        }),
        ('Status', {
            'fields': ('status', 'payment_status', 'total_price')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'amount', 'status', 'razorpay_order_id', 'created_at', 'paid_at')
    list_filter = ('status', 'created_at', 'paid_at')
    search_fields = ('booking__user__email', 'razorpay_order_id', 'razorpay_payment_id')
    readonly_fields = ('created_at', 'paid_at')
