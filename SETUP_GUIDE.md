# 🚀 Quick Setup Guide

## Initial Setup Steps

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
# Add your database credentials and secret key

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Add your API URLs and keys

# Run development server
npm run dev
```

### 3. Database Setup

#### Option A: PostgreSQL (Recommended for Production)
1. Install PostgreSQL
2. Create database: `createdb garbage_management`
3. Update `.env` with database credentials

#### Option B: SQLite (For Development)
Update `backend/garbage_management/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### 4. Add Initial Data

#### Create Waste Types (via Admin or Django Shell)
```python
python manage.py shell

from waste.models import WasteType

WasteType.objects.create(
    name="Bio Waste",
    description="Organic waste that can be composted",
    price_per_kg=10.00
)

WasteType.objects.create(
    name="Non-Bio Waste",
    description="Non-biodegradable waste",
    price_per_kg=15.00
)

WasteType.objects.create(
    name="Recyclable Waste",
    description="Materials that can be processed and reused",
    price_per_kg=20.00
)
```

#### Create Collection Centers
```python
from waste.models import Center

Center.objects.create(
    name="North Collection Center",
    address="123 Main St, City",
    latitude=28.6139,
    longitude=77.2090,
    contact_info="+91-1234567890"
)

# Add more centers as needed
```

### 5. Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create API key
5. Add to `frontend/.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your-api-key-here
   ```

### 6. Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from Dashboard → Settings → API Keys
3. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=your-key-id
   RAZORPAY_KEY_SECRET=your-key-secret
   ```
4. Add to `frontend/.env`:
   ```
   VITE_RAZORPAY_KEY_ID=your-key-id
   ```

### 7. Complete Razorpay Integration

The payment views currently have placeholder code. To complete Razorpay integration:

1. Install Razorpay Python SDK:
   ```bash
   pip install razorpay
   ```

2. Update `backend/waste/views.py` PaymentCreateView:
   ```python
   import razorpay
   from django.conf import settings
   
   client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
   
   # In PaymentCreateView.post():
   order = client.order.create({
       'amount': int(payment.amount * 100),  # Amount in paise
       'currency': 'INR',
       'receipt': f'booking_{booking.id}'
   })
   payment.razorpay_order_id = order['id']
   ```

3. Update PaymentVerifyView:
   ```python
   # Verify signature
   params_dict = {
       'razorpay_order_id': razorpay_order_id,
       'razorpay_payment_id': razorpay_payment_id,
       'razorpay_signature': razorpay_signature
   }
   client.utility.verify_payment_signature(params_dict)
   ```

### 8. Media Files Setup

Media files (waste images) will be stored in `backend/media/` directory.
Make sure this directory exists and is writable.

### 9. CORS Configuration

For production, update `backend/garbage_management/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```

Remove `CORS_ALLOW_ALL_ORIGINS = True` in production.

## 🧪 Testing the Setup

1. **Backend**: Visit `http://localhost:8000/admin/` and login
2. **API**: Test endpoints using Postman or curl
3. **Frontend**: Visit `http://localhost:5173/` (default Vite port)

## 📝 Common Issues

### Migration Errors
```bash
# Reset migrations (development only!)
python manage.py migrate --run-syncdb
```

### Port Already in Use
```bash
# Backend: Use different port
python manage.py runserver 8001

# Frontend: Update VITE_API_BASE_URL in .env
```

### Google Maps Not Loading
- Check API key is correct
- Verify Maps JavaScript API is enabled
- Check browser console for errors

### Payment Not Working
- Verify Razorpay keys are correct
- Check Razorpay dashboard for test mode
- Complete Razorpay SDK integration (see step 7)

## ✅ Verification Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running
- [ ] Database connected
- [ ] Admin panel accessible
- [ ] Can register/login users
- [ ] Waste types visible
- [ ] Google Maps loading
- [ ] Can create bookings
- [ ] Payment flow works (after Razorpay setup)

