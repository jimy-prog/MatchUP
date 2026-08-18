import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import type { Venue } from '@/types';

const seedVenues: Omit<Venue, 'id'>[] = [
  {
    ownerId: 'system',
    name: 'Lokomotiv Stadium',
    description: 'Professional football stadium with natural grass pitch. Changing rooms and parking available.',
    address: 'Tashkent, Shaykhontohur District',
    location: { lat: 41.2995, lng: 69.2401 },
    images: ['https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=800'],
    amenities: ['Parking', 'Changing Rooms', 'Floodlights', 'Showers'],
    sports: ['football'],
    pricePerHour: 150000,
    status: 'active',
    rating: 4.5,
    reviewCount: 12,
    phone: '+998 71 123 4567',
    openHours: '06:00 - 23:00',
  },
  {
    ownerId: 'system',
    name: 'Humo Arena',
    description: 'Modern multi-sport indoor arena. Basketball, volleyball, and badminton courts available.',
    address: 'Tashkent, Yunusabad District',
    location: { lat: 41.3456, lng: 69.2845 },
    images: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
    amenities: ['Parking', 'Changing Rooms', 'Air Conditioning', 'Cafe'],
    sports: ['basketball', 'volleyball', 'badminton'],
    pricePerHour: 200000,
    status: 'active',
    rating: 4.8,
    reviewCount: 24,
    phone: '+998 71 234 5678',
    openHours: '08:00 - 22:00',
  },
  {
    ownerId: 'system',
    name: 'National Tennis Center',
    description: 'Clay and hard courts with professional coaching available. Equipment rental on site.',
    address: 'Tashkent, Mirabad District',
    location: { lat: 41.2789, lng: 69.2156 },
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800'],
    amenities: ['Parking', 'Changing Rooms', 'Equipment Rental', 'Coaching'],
    sports: ['tennis'],
    pricePerHour: 120000,
    status: 'active',
    rating: 4.3,
    reviewCount: 8,
    phone: '+998 71 345 6789',
    openHours: '07:00 - 21:00',
  },
  {
    ownerId: 'system',
    name: 'Olympic Pool',
    description: 'Olympic-size swimming pool with 8 lanes. Temperature controlled water.',
    address: 'Tashkent, Yakkasaray District',
    location: { lat: 41.3123, lng: 69.2789 },
    images: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800'],
    amenities: ['Parking', 'Changing Rooms', 'Lockers', 'Sauna'],
    sports: ['swimming'],
    pricePerHour: 80000,
    status: 'active',
    rating: 4.6,
    reviewCount: 15,
    phone: '+998 71 456 7890',
    openHours: '06:00 - 22:00',
  },
  {
    ownerId: 'system',
    name: 'Uzbekistan Boxing Gym',
    description: 'Professional boxing gym with rings, bags, and full fitness equipment.',
    address: 'Tashkent, Chilonzor District',
    location: { lat: 41.2678, lng: 69.1934 },
    images: ['https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800'],
    amenities: ['Parking', 'Changing Rooms', 'Showers', 'Equipment'],
    sports: ['boxing'],
    pricePerHour: 100000,
    status: 'active',
    rating: 4.4,
    reviewCount: 6,
    phone: '+998 71 567 8901',
    openHours: '06:00 - 23:00',
  },
];

export async function seedVenues(): Promise<void> {
  const venuesRef = collection(db, 'venues');
  for (const venue of seedVenues) {
    await addDoc(venuesRef, { ...venue, createdAt: new Date() });
  }
  console.log(`Seeded ${seedVenues.length} venues`);
}
