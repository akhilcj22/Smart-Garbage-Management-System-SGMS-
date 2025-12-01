# How to Add Waste Types

You can add waste types (including Electronic Waste) to the system in several ways:

## Method 1: Using Django Admin Panel (Easiest)

1. Start your Django server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. Go to: `http://localhost:8000/admin/`

3. Login with your superuser credentials

4. Click on **Waste Types** under the **WASTE** section

5. Click **Add Waste Type** button

6. Fill in the form:
   - **Name**: `Electronic Waste` (or `E-Waste`)
   - **Description**: `Electronic devices and components including computers, phones, batteries, and other electronic equipment that require special handling and recycling.`
   - **Price per kg**: `25.00` (or your preferred price)

7. Click **Save**

## Method 2: Using Django Shell

1. Open Django shell:
   ```bash
   cd backend
   python manage.py shell
   ```

2. Run the following commands:
   ```python
   from waste.models import WasteType

   # Add Electronic Waste
   WasteType.objects.create(
       name="Electronic Waste",
       description="Electronic devices and components including computers, phones, batteries, and other electronic equipment that require special handling and recycling.",
       price_per_kg=25.00
   )

   # Or add E-Waste
   WasteType.objects.create(
       name="E-Waste",
       description="Electronic waste including computers, mobile phones, batteries, and other electronic devices.",
       price_per_kg=25.00
   )
   ```

3. Exit shell: `exit()`

## Method 3: Using Management Command (Recommended)

I've created a custom management command for easy addition:

```bash
cd backend

# Add Electronic Waste
python manage.py add_waste_type "Electronic Waste" 25.00 --description "Electronic devices and components including computers, phones, batteries, and other electronic equipment that require special handling and recycling."

# Or add E-Waste
python manage.py add_waste_type "E-Waste" 25.00 --description "Electronic waste including computers, mobile phones, batteries, and other electronic devices."
```

## Method 4: Add Multiple Waste Types at Once

You can create a Python script to add multiple waste types:

```python
# add_initial_waste_types.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'garbage_management.settings')
django.setup()

from waste.models import WasteType

waste_types = [
    {
        'name': 'Bio Waste',
        'description': 'Organic waste that can be composted, including food scraps, garden waste, and other biodegradable materials.',
        'price_per_kg': 10.00
    },
    {
        'name': 'Non-Bio Waste',
        'description': 'Non-biodegradable waste that requires special handling, including plastics, metals, and synthetic materials.',
        'price_per_kg': 15.00
    },
    {
        'name': 'Recyclable Waste',
        'description': 'Materials that can be processed and reused, including paper, cardboard, glass, and certain plastics.',
        'price_per_kg': 20.00
    },
    {
        'name': 'Electronic Waste',
        'description': 'Electronic devices and components including computers, phones, batteries, and other electronic equipment that require special handling and recycling.',
        'price_per_kg': 25.00
    },
    {
        'name': 'Hazardous Waste',
        'description': 'Waste that poses substantial or potential threats to public health or the environment, including chemicals, medical waste, and toxic materials.',
        'price_per_kg': 30.00
    },
    {
        'name': 'Metal Waste',
        'description': 'Scrap metal including iron, steel, aluminum, copper, and other metals that can be recycled.',
        'price_per_kg': 18.00
    },
]

for wt in waste_types:
    waste_type, created = WasteType.objects.get_or_create(
        name=wt['name'],
        defaults={
            'description': wt['description'],
            'price_per_kg': wt['price_per_kg']
        }
    )
    if created:
        print(f"✓ Created: {wt['name']}")
    else:
        print(f"⚠ Already exists: {wt['name']}")
```

Run it:
```bash
cd backend
python add_initial_waste_types.py
```

## Recommended Waste Types

Here are some common waste types you might want to add:

1. **Electronic Waste** - ₹25/kg
2. **Hazardous Waste** - ₹30/kg
3. **Metal Waste** - ₹18/kg
4. **Glass Waste** - ₹12/kg
5. **Textile Waste** - ₹8/kg
6. **Construction Waste** - ₹15/kg

## Verify Waste Types

After adding, verify they appear:

1. In Django Admin: `http://localhost:8000/admin/waste/wastetype/`
2. Via API: `http://localhost:8000/api/waste/types/`
3. In Frontend: Visit `/waste-types` page

## Notes

- Prices are in Indian Rupees (₹)
- You can update prices anytime through the admin panel
- Waste types are immediately available for booking once created
- The system supports unlimited waste types

