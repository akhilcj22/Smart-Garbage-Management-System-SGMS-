from rest_framework import serializers
from .models import WasteType, Center, Booking, Payment
from users.serializers import UserSerializer

class WasteTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteType
        fields = "__all__"


class CenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Center
        fields = "__all__"


class BookingSerializer(serializers.ModelSerializer):
    waste_type = WasteTypeSerializer(read_only=True)
    waste_type_id = serializers.PrimaryKeyRelatedField(
        queryset=WasteType.objects.all(),
        source='waste_type',
        write_only=True
    )
    selected_center = CenterSerializer(read_only=True)
    selected_center_id = serializers.PrimaryKeyRelatedField(
        queryset=Center.objects.all(),
        source='selected_center',
        write_only=True,
        required=False,
        allow_null=True
    )
    user = UserSerializer(read_only=True)
    waste_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'waste_type', 'waste_type_id', 'quantity_kg',
            'pickup_date', 'pickup_time', 'address', 'selected_center',
            'selected_center_id', 'waste_image', 'status', 'payment_status',
            'total_price', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'status', 'payment_status', 'total_price', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'razorpay_order_id', 'razorpay_payment_id',
            'razorpay_signature', 'amount', 'status', 'created_at', 'paid_at'
        ]
        read_only_fields = ['status', 'created_at', 'paid_at']
