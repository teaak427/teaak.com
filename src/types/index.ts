export interface User {
  id: string;
  citizenId: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  position: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  pricePerUnit?: number; // Giá 1 viên
  image: string;
  activeIngredient: string; // Hoạt chất
  specification: string; // Quy cách (ví dụ: "Hộp 10 vỉ x 10 viên")
  stock: number; // Số lượng tồn kho
  isActive: boolean; // Trạng thái hoạt động
  code: string; // Mã sản phẩm
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string; // Hình ảnh chương trình khuyến mãi
  startDate: Date;
  endDate: Date;
  applicableProducts: string[];
  region: 'nationwide' | 'north' | 'central' | 'south'; // Khu vực áp dụng
  isActive: boolean;
  createdBy: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  notes?: string;
  createdBy: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate: Date;
  issuingAuthority: string;
  documentUrl: string;
  relatedProducts: string[];
  status: 'active' | 'expired' | 'pending';
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  extension?: string;
  avatar?: string;
  specialization: string[];
  isAvailable: boolean;
}