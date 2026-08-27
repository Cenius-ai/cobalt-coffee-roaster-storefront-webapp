import { CartItem } from './cart.model';

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  zip: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;       // integer cents
  shippingCost: number;   // integer cents
  total: number;          // integer cents
  shippingAddress: ShippingAddress;
  status: 'pending' | 'confirmed';
  createdAt: Date;
}
