from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from math import radians, cos, sin, asin, sqrt
from decimal import Decimal
from .models import WasteType, Center, Booking, Payment
from .serializers import WasteTypeSerializer, CenterSerializer, BookingSerializer, PaymentSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


class WasteTypeListView(generics.ListAPIView):
    queryset = WasteType.objects.all()
    serializer_class = WasteTypeSerializer
    permission_classes = [AllowAny]


class CenterListView(generics.ListAPIView):
    queryset = Center.objects.all()
    serializer_class = CenterSerializer
    permission_classes = [AllowAny]


class NearestCenterView(APIView):
    permission_classes = [AllowAny]
    
    def haversine(self, lat1, lon1, lat2, lon2):
        """Calculate the great circle distance between two points on Earth"""
        # Convert decimal degrees to radians
        lat1, lon1, lat2, lon2 = map(radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Radius of earth in kilometers
        return c * r
    
    def post(self, request):
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if not latitude or not longitude:
            return Response(
                {'error': 'Latitude and longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        centers = Center.objects.all()
        nearest_center = None
        min_distance = float('inf')
        
        for center in centers:
            distance = self.haversine(
                latitude, longitude,
                center.latitude, center.longitude
            )
            if distance < min_distance:
                min_distance = distance
                nearest_center = center
        
        if nearest_center:
            serializer = CenterSerializer(nearest_center)
            return Response({
                'center': serializer.data,
                'distance_km': round(min_distance, 2)
            })
        
        return Response(
            {'error': 'No centers found'},
            status=status.HTTP_404_NOT_FOUND
        )


class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class BookingListView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class PaymentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        booking_id = request.data.get('booking_id')
        amount = request.data.get('amount')
        
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create payment record
        payment, created = Payment.objects.get_or_create(
            booking=booking,
            defaults={'amount': amount or booking.total_price}
        )
        
        # For Razorpay integration, you would create an order here
        # This is a placeholder - you'll need to integrate Razorpay SDK
        razorpay_order_id = f"order_{payment.id}_{booking.id}"
        payment.razorpay_order_id = razorpay_order_id
        payment.save()
        
        serializer = PaymentSerializer(payment)
        return Response({
            'payment': serializer.data,
            'razorpay_order_id': razorpay_order_id,
            'amount': float(payment.amount),
            # Add Razorpay key_id from settings
        })


class PaymentVerifyView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        try:
            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id,
                booking__user=request.user
            )
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify Razorpay signature here
        # This is a placeholder - implement actual Razorpay verification
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'paid'
        payment.save()
        
        # Update booking payment status
        booking = payment.booking
        booking.payment_status = 'paid'
        booking.save()
        
        serializer = PaymentSerializer(payment)
        return Response({
            'success': True,
            'payment': serializer.data
        })
