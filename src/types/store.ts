export type ProductCategory = 'All' | 'Audio' | 'Wearables' | 'Smart Home' | 'Accessories';

export type ThemeMode = 'dark' | 'light';

export interface DiscountCampaign {
  id: string;
  code: string;
  discountPercent: number;
  announcementText: string;
  isActive: boolean;
  isBestOffer?: boolean;
}

export interface VendorStore {
  id: string;
  storeName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  rating: number;
  joinedDate: string;
  totalSales: number;
  completedOrders: number;
  isVerified: boolean;
  isFlagged?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  description: string;
  specs: Record<string, string>;
  colors?: { name: string; hex: string }[];
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  stockQuantity?: number;
  vendorName?: string;
  isFlagged?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  shippingMethod: 'standard' | 'express' | 'overnight';
}

export interface PaymentDetails {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: 'card' | 'apple_pay' | 'paypal';
}

export interface OrderState {
  orderId: string;
  date: string;
  items: CartItem[];
  shipping: ShippingDetails;
  subtotal: number;
  tax: number;
  discount: number;
  shippingCost: number;
  total: number;
}
