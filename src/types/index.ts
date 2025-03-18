export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  categoryName?: string;
  stock: number;
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  createOrder: (customerName: string, customerPhone: string, customerAddress: string) => Promise<Order | null>;
  isLoading: boolean;
  orderError: string | null;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface AdminDataContextType {
  categories: Category[];
  products: Product[];
  orders: Order[];
  settings: StoreSettings | null;
  isLoading: boolean;
  error: string | null;
  
  // Fetch operations
  fetchCategories: () => Promise<Category[]>;
  fetchProducts: () => Promise<Product[]>;
  fetchOrders: () => Promise<Order[]>;
  fetchSettings: () => Promise<StoreSettings>;
  
  // Category operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category | null>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  toggleCategoryStatus: (id: number) => Promise<boolean>;
  
  // Product operations
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
  toggleProductStatus: (id: number) => Promise<boolean>;
  
  // Order operations
  updateOrderStatus: (id: number, status: Order['status']) => Promise<boolean>;
  
  // Settings operations
  updateSetting: (name: string, value: any) => Promise<boolean>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<boolean>;
}

export interface Setting {
  name: string;
  value: string | number | boolean | object;
  type: 'string' | 'number' | 'boolean' | 'json';
}

export interface StoreSettings {
  store_name: string;
  store_address: string;
  store_phone: string;
  store_email: string;
  delivery_fee: number;
  min_order_value: number;
  delivery_time: string;
  opening_hours: {
    [day: string]: { open: string; close: string };
  };
  accept_orders: boolean;
  maintenance_mode: boolean;
  social_media: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    [key: string]: string | undefined;
  };
  [key: string]: any;
} 