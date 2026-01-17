// types.ts

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt: string;
}

export interface ProductImage {
  _key: string;
  asset: {
    _id: string;
    url: string;
  };
  hotspot?: any; // Define more specifically if needed
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  brand: string;
  stock: number;
  images: ProductImage[];
  rating?: number;
  numReviews?: number;
  featured?: boolean;
  freeShipping?: boolean;
  createdAt?: string;
  material?: string;
  color?: string;
  dimensions?: string;
  assemblyRequired?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}