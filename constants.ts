
import { Product } from './types';

export const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Sports'];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Precision Wireless Mouse',
    price: 49.99,
    category: 'Electronics',
    description: 'Ergonomic design with high-precision optical sensor. Perfect for professional workflows.',
    image: 'https://picsum.photos/seed/mouse1/600/800',
    secondaryImage: 'https://picsum.photos/seed/mouse2/600/800',
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    featured: true
  },
  {
    id: '2',
    name: 'Premium Canvas Backpack',
    price: 89.00,
    category: 'Clothing',
    description: 'Durable, water-resistant canvas with leather accents and padded laptop compartment.',
    image: 'https://picsum.photos/seed/backpack1/600/800',
    secondaryImage: 'https://picsum.photos/seed/backpack2/600/800',
    rating: 4.5,
    reviewsCount: 89,
    stock: 22,
    featured: true
  },
  {
    id: '3',
    name: 'Minimalist Desk Lamp',
    price: 35.50,
    category: 'Home',
    description: 'Sleek aluminum body with touch-sensitive dimming and adjustable color temperature.',
    image: 'https://picsum.photos/seed/lamp1/600/800',
    secondaryImage: 'https://picsum.photos/seed/lamp2/600/800',
    rating: 4.7,
    reviewsCount: 56,
    stock: 10
  },
  {
    id: '4',
    name: 'Mechanical Keyboard TKL',
    price: 129.99,
    category: 'Electronics',
    description: 'Hotswappable switches with RGB backlighting and aluminum frame.',
    image: 'https://picsum.photos/seed/kb1/600/800',
    secondaryImage: 'https://picsum.photos/seed/kb2/600/800',
    rating: 4.9,
    reviewsCount: 230,
    stock: 5,
    featured: true
  },
  {
    id: '5',
    name: 'The Art of Design',
    price: 24.95,
    category: 'Books',
    description: 'A comprehensive guide to modern visual communication and aesthetics.',
    image: 'https://picsum.photos/seed/book1/600/800',
    secondaryImage: 'https://picsum.photos/seed/book2/600/800',
    rating: 4.2,
    reviewsCount: 42,
    stock: 50
  },
  {
    id: '6',
    name: 'Active Noise Cancelling Headphones',
    price: 299.00,
    category: 'Electronics',
    description: 'Industry-leading noise cancellation with 30-hour battery life and superior sound.',
    image: 'https://picsum.photos/seed/hp1/600/800',
    secondaryImage: 'https://picsum.photos/seed/hp2/600/800',
    rating: 4.8,
    reviewsCount: 512,
    stock: 8,
    featured: true
  },
  {
    id: '7',
    name: 'Organic Cotton T-Shirt',
    price: 25.00,
    category: 'Clothing',
    description: 'Ultra-soft, sustainably sourced organic cotton with a perfect modern fit.',
    image: 'https://picsum.photos/seed/tshirt1/600/800',
    secondaryImage: 'https://picsum.photos/seed/tshirt2/600/800',
    rating: 4.4,
    reviewsCount: 167,
    stock: 100
  },
  {
    id: '8',
    name: 'Ceramic Pour-Over Kettle',
    price: 55.00,
    category: 'Home',
    description: 'Matte finish ceramic kettle with precision gooseneck spout for perfect coffee.',
    image: 'https://picsum.photos/seed/kettle1/600/800',
    secondaryImage: 'https://picsum.photos/seed/kettle2/600/800',
    rating: 4.6,
    reviewsCount: 78,
    stock: 12,
    featured: true
  },
  {
    id: '9',
    name: 'Yoga Performance Mat',
    price: 75.00,
    category: 'Sports',
    description: 'Extra thick, non-slip grip surface with alignment marks for perfect form.',
    image: 'https://picsum.photos/seed/yoga1/600/800',
    secondaryImage: 'https://picsum.photos/seed/yoga2/600/800',
    rating: 4.7,
    reviewsCount: 112,
    stock: 30
  },
  {
    id: '10',
    name: 'Smart Fitness Tracker',
    price: 119.00,
    category: 'Electronics',
    description: 'Track steps, heart rate, sleep and SPO2 with built-in GPS and 7-day battery.',
    image: 'https://picsum.photos/seed/track1/600/800',
    secondaryImage: 'https://picsum.photos/seed/track2/600/800',
    rating: 4.5,
    reviewsCount: 345,
    stock: 25
  },
  {
    id: '11',
    name: 'Essential Oil Diffuser',
    price: 42.00,
    category: 'Home',
    description: 'Ultrasonic technology with wood grain finish and 7 color LED ambient light.',
    image: 'https://picsum.photos/seed/diff1/600/800',
    secondaryImage: 'https://picsum.photos/seed/diff2/600/800',
    rating: 4.3,
    reviewsCount: 88,
    stock: 18
  },
  {
    id: '12',
    name: 'Carbon Fiber Road Bike',
    price: 2499.00,
    category: 'Sports',
    description: 'Professional grade ultralight carbon frame with high-precision components.',
    image: 'https://picsum.photos/seed/bike1/600/800',
    secondaryImage: 'https://picsum.photos/seed/bike2/600/800',
    rating: 5.0,
    reviewsCount: 15,
    stock: 3,
    featured: true
  }
];
