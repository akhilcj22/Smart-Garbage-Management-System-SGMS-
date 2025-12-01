# 🌍 Smart Garbage Management System (SGMS)

A full-stack waste management system built with Django REST Framework and React, featuring Google Maps integration and payment processing.

## 🚀 Features

### Phase 1 - Core Setup ✅
- Django REST Framework backend
- JWT Authentication
- Custom User model (email-based)
- React frontend with Vite
- Protected routes and authentication context

### Phase 2 - Waste Types Module ✅
- Waste type management (Bio, Non-Bio, Recyclable)
- Pricing per kg
- Public API for waste types

### Phase 3 - Collection Centers & Google Maps ✅
- Center model with location data
- Google Maps integration
- Nearest center calculation using Haversine formula
- Interactive map with markers

### Phase 4 - Booking System ✅
- Complete booking flow
- Waste image upload support
- Date/time selection
- Center selection via map
- Booking status tracking

### Phase 5 - Payment Integration ✅
- Razorpay payment gateway integration
- Payment verification
- Booking payment status tracking

### Phase 6 - User Dashboard ✅
- User dashboard with statistics
- Booking history
- Booking details view
- Payment status tracking

### Phase 7 - Admin Panel ✅
- Django admin for all models
- Booking management
- Status updates
- Payment tracking

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (or SQLite for development)
- Google Maps API key
- Razorpay account (for payments)

## 🛠️ Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file in backend directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=garbage_management
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

5. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Run development server:
```bash
python manage.py runserver
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend directory:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

4. Start development server:
```bash
npm run dev
```

## 📁 Project Structure

```
Smart-Garbage-Management-System-SGMS-/
├── backend/
│   ├── garbage_management/    # Django project settings
│   ├── users/                  # User authentication app
│   ├── waste/                  # Waste management app
│   │   ├── models.py          # WasteType, Center, Booking, Payment
│   │   ├── views.py           # API views
│   │   ├── serializers.py     # DRF serializers
│   │   └── admin.py           # Admin configurations
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── pages/             # React pages
│   │   │   ├── Welcome.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BookingCreate.jsx
│   │   │   ├── Payment.jsx
│   │   │   └── BookingHistory.jsx
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React context
│   │   └── services/          # API services
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/token/` - Login (JWT token)
- `POST /api/auth/token/refresh/` - Refresh token
- `GET /api/auth/me/` - Get current user
- `PATCH /api/auth/me/update/` - Update profile
- `POST /api/auth/change_password/` - Change password

### Waste Types
- `GET /api/waste/types/` - List all waste types

### Centers
- `GET /api/waste/centers/` - List all centers
- `POST /api/waste/centers/nearest/` - Find nearest center

### Bookings
- `POST /api/waste/booking/create/` - Create booking
- `GET /api/waste/booking/history/` - User's booking history
- `GET /api/waste/booking/<id>/` - Booking details

### Payments
- `POST /api/waste/payment/create/` - Create payment order
- `POST /api/waste/payment/verify/` - Verify payment

## 🗄️ Database Models

### User
- email (unique)
- name
- phone
- address
- password

### WasteType
- name
- description
- price_per_kg

### Center
- name
- address
- latitude
- longitude
- contact_info

### Booking
- user (ForeignKey)
- waste_type (ForeignKey)
- quantity_kg
- pickup_date
- pickup_time
- address
- selected_center (ForeignKey)
- waste_image (ImageField)
- status (pending, accepted, in_progress, completed, cancelled)
- payment_status (pending, paid, failed)
- total_price

### Payment
- booking (OneToOne)
- razorpay_order_id
- razorpay_payment_id
- razorpay_signature
- amount
- status

## 🎨 Frontend Routes

- `/` - Welcome page
- `/login` - Login page
- `/register` - Registration page
- `/profile` - User profile (protected)
- `/waste-types` - View waste types
- `/booking/create` - Create booking (protected)
- `/booking/:id/payment` - Payment page (protected)
- `/booking/:id/success` - Booking success (protected)
- `/booking/history` - Booking history (protected)
- `/booking/:id` - Booking details (protected)
- `/dashboard` - User dashboard (protected)

## 🔐 Environment Variables

### Backend (.env)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `VITE_RAZORPAY_KEY_ID` - Razorpay key ID

## 🧪 Testing

### Backend
```bash
cd backend
python manage.py test
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Admin Panel

Access the admin panel at `http://localhost:8000/admin/`

Features:
- Manage waste types
- Manage collection centers
- View and update bookings
- Track payments
- Manage users

## 🚢 Deployment

### Backend (Render/Railway/AWS)
1. Set environment variables
2. Use PostgreSQL database
3. Set `DEBUG=False`
4. Configure `ALLOWED_HOSTS`
5. Set up static files serving

### Frontend (Vercel/Netlify)
1. Set environment variables
2. Build command: `npm run build`
3. Output directory: `dist`

## 🔧 Configuration Notes

### Google Maps
1. Get API key from Google Cloud Console
2. Enable Maps JavaScript API
3. Add to frontend `.env` file

### Razorpay
1. Create Razorpay account
2. Get API keys from dashboard
3. Add to both backend and frontend `.env` files
4. Update payment verification logic in `backend/waste/views.py`

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the repository.

---

**Note**: Make sure to run migrations after pulling the latest code:
```bash
python manage.py makemigrations
python manage.py migrate
```

