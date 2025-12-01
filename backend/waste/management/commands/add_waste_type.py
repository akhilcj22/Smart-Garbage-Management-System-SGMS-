from django.core.management.base import BaseCommand
from waste.models import WasteType


class Command(BaseCommand):
    help = 'Add a new waste type to the system'

    def add_arguments(self, parser):
        parser.add_argument('name', type=str, help='Name of the waste type')
        parser.add_argument('price', type=float, help='Price per kg')
        parser.add_argument('--description', type=str, default='', help='Description of the waste type')

    def handle(self, *args, **options):
        name = options['name']
        price = options['price']
        description = options.get('description', '')

        waste_type, created = WasteType.objects.get_or_create(
            name=name,
            defaults={
                'price_per_kg': price,
                'description': description
            }
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created waste type: {name} at ₹{price}/kg')
            )
        else:
            self.stdout.write(
                self.style.WARNING(f'Waste type "{name}" already exists. Updating price to ₹{price}/kg')
            )
            waste_type.price_per_kg = price
            if description:
                waste_type.description = description
            waste_type.save()
            self.stdout.write(
                self.style.SUCCESS(f'Successfully updated waste type: {name}')
            )

