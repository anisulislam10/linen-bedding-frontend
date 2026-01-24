
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  secondaryImage: string; // Added for hover effect
  rating: number;
  reviewsCount: number;
  stock: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  total: number;
  items: { name: string; quantity: number }[];
}
