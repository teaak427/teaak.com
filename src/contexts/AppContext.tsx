import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductCategory, Promotion, Order, CartItem, Certificate, Employee, User } from '../types';

interface AppContextType {
  // Products
  products: Product[];
  categories: ProductCategory[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Categories
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;
  
  // Promotions
  promotions: Promotion[];
  addPromotion: (promotion: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber'>) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;
  
  // Cart
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  // Certificates
  certificates: Certificate[];
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  
  // Employees
  employees: Employee[];
  
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Notifications
  showCartNotification: (product: Product, quantity: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data - Simplified products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Thuốc giảm đau, hạ sốt hiệu quả',
    category: '1',
    price: 15000,
    pricePerUnit: 1500,
    image: 'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg',
    activeIngredient: 'Paracetamol 500mg',
    specification: 'Hộp 10 vỉ x 10 viên',
    stock: 150,
    isActive: true,
    code: 'PAR500',
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Thuốc kháng sinh phổ rộng',
    category: '2',
    price: 25000,
    pricePerUnit: 1250,
    image: 'https://images.pexels.com/photos/5863385/pexels-photo-5863385.jpeg',
    activeIngredient: 'Amoxicillin trihydrate 250mg',
    specification: 'Hộp 20 viên nang',
    stock: 80,
    isActive: true,
    code: 'AMO250',
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    description: 'Vitamin C tăng cường sức đề kháng',
    category: '3',
    price: 120000,
    pricePerUnit: 4000,
    image: 'https://images.pexels.com/photos/5863385/pexels-photo-5863385.jpeg',
    activeIngredient: 'Acid ascorbic 1000mg',
    specification: 'Hộp 30 viên sủi',
    stock: 200,
    isActive: true,
    code: 'VTC1000',
  },
  {
    id: '4',
    name: 'Ibuprofen 400mg',
    description: 'Thuốc chống viêm, giảm đau',
    category: '1',
    price: 18000,
    pricePerUnit: 900,
    image: 'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg',
    activeIngredient: 'Ibuprofen 400mg',
    specification: 'Hộp 20 viên nén',
    stock: 120,
    isActive: true,
    code: 'IBU400',
  },
  {
    id: '5',
    name: 'Omega-3 Fish Oil',
    description: 'Dầu cá Omega-3 bổ sung DHA, EPA',
    category: '3',
    price: 350000,
    pricePerUnit: 5833,
    image: 'https://images.pexels.com/photos/5863385/pexels-photo-5863385.jpeg',
    activeIngredient: 'Omega-3 1000mg (EPA 300mg, DHA 200mg)',
    specification: 'Hộp 60 viên nang mềm',
    stock: 75,
    isActive: true,
    code: 'OME1000',
  },
  {
    id: '6',
    name: 'Cephalexin 500mg',
    description: 'Thuốc kháng sinh nhóm Cephalosporin',
    category: '2',
    price: 45000,
    pricePerUnit: 2250,
    image: 'https://images.pexels.com/photos/5863385/pexels-photo-5863385.jpeg',
    activeIngredient: 'Cephalexin 500mg',
    specification: 'Hộp 20 viên nang',
    stock: 60,
    isActive: true,
    code: 'CEP500',
  },
];

const mockCategories: ProductCategory[] = [
  { id: '1', name: 'Thuốc giảm đau', description: 'Các loại thuốc giảm đau, hạ sốt', isActive: true },
  { id: '2', name: 'Kháng sinh', description: 'Các loại thuốc kháng sinh', isActive: true },
  { id: '3', name: 'Vitamin & Thực phẩm chức năng', description: 'Vitamin và các sản phẩm bổ sung', isActive: true },
];

// Tạo ngày hiện tại và các ngày trong tương lai gần
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);

const in3Days = new Date(today);
in3Days.setDate(today.getDate() + 3);

const in5Days = new Date(today);
in5Days.setDate(today.getDate() + 5);

const in10Days = new Date(today);
in10Days.setDate(today.getDate() + 10);

const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Flash Sale Thuốc Giảm Đau',
    description: 'Ưu đãi đặc biệt cho tất cả thuốc giảm đau và hạ sốt. Áp dụng cho Paracetamol, Ibuprofen và các sản phẩm tương tự.',
    image: 'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg',
    startDate: today,
    endDate: in3Days,
    applicableProducts: ['1', '4'],
    region: 'nationwide',
    isActive: true,
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Combo Kháng Sinh Miền Bắc',
    description: 'Chương trình đặc biệt dành riêng cho khu vực miền Bắc: Mua 2 hộp thuốc kháng sinh bất kỳ, tặng ngay 1 hộp cùng loại.',
    image: 'https://images.pexels.com/photos/5863385/pexels-photo-5863385.jpeg',
    startDate: today,
    endDate: in5Days,
    applicableProducts: ['2', '6'],
    region: 'north',
    isActive: true,
    createdBy: '1',
  },
  {
    id: '3',
    title: 'Vitamin Week Miền Trung',
    description: 'Tuần lễ Vitamin đặc biệt cho khu vực miền Trung! Giảm giá sốc cho tất cả sản phẩm vitamin và thực phẩm chức năng.',
    image: 'https://images.pexels.com/photos/5863385/pexels-photo-5863385.jpeg',
    startDate: today,
    endDate: nextWeek,
    applicableProducts: ['3', '5'],
    region: 'central',
    isActive: true,
    createdBy: '1',
  },
  {
    id: '4',
    title: 'Sức Khỏe Miền Nam',
    description: 'Chào mừng khách hàng miền Nam với ưu đãi đặc biệt! Giảm giá toàn bộ sản phẩm, tặng kèm quà tặng ý nghĩa.',
    image: 'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg',
    startDate: today,
    endDate: in10Days,
    applicableProducts: ['1', '2', '3', '4', '5', '6'],
    region: 'south',
    isActive: true,
    createdBy: '1',
  },
  {
    id: '5',
    title: 'Siêu Sale Cuối Năm',
    description: 'Chương trình siêu khuyến mãi cuối năm áp dụng toàn quốc! Giảm giá khủng cho tất cả sản phẩm.',
    image: 'https://images.pexels.com/photos/5863385/pexels-photo-5863385.jpeg',
    startDate: today,
    endDate: nextMonth,
    applicableProducts: ['1', '2', '3', '4', '5', '6'],
    region: 'nationwide',
    isActive: true,
    createdBy: '1',
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: 'CUST001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0123456789',
    customerAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP.HCM',
    items: [
      {
        productId: '1',
        productName: 'Paracetamol 500mg',
        quantity: 10,
        unitPrice: 15000,
        totalPrice: 150000,
      },
    ],
    totalAmount: 150000,
    discountAmount: 0,
    finalAmount: 150000,
    status: 'pending',
    orderDate: new Date(),
    createdBy: '1',
  },
];

const mockCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Giấy phép sản xuất thuốc',
    description: 'Giấy phép sản xuất các loại thuốc theo tiêu chuẩn GMP',
    certificateNumber: 'GPL-2024-001',
    issueDate: new Date('2024-01-01'),
    expiryDate: new Date('2026-12-31'),
    issuingAuthority: 'Bộ Y tế',
    documentUrl: '/certificates/gpl-2024-001.pdf',
    relatedProducts: ['1', '2'],
    status: 'active',
  },
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Dr. Nguyễn Văn Hùng',
    position: 'Dược sĩ trưởng',
    department: 'Dược lâm sàng',
    email: 'hung.nguyen@fremed.com',
    phone: '0123456789',
    extension: '101',
    specialization: ['Dược lâm sàng', 'Tư vấn thuốc'],
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Trần Thị Mai',
    position: 'Chuyên viên CSKH',
    department: 'Chăm sóc khách hàng',
    email: 'mai.tran@fremed.com',
    phone: '0987654321',
    extension: '102',
    specialization: ['Tư vấn khách hàng', 'Xử lý khiếu nại'],
    isAvailable: true,
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    citizenId: '079123456789',
    name: 'Nguyễn Văn Admin',
    email: 'admin@fremed.com',
    role: 'admin',
    department: 'IT',
    position: 'System Administrator',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    citizenId: '079987654321',
    name: 'Trần Thị Manager',
    email: 'manager@fremed.com',
    role: 'manager',
    department: 'Sales',
    position: 'Sales Manager',
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    citizenId: '079555666777',
    name: 'Lê Văn Employee',
    email: 'employee@fremed.com',
    role: 'employee',
    department: 'Warehouse',
    position: 'Warehouse Staff',
    isActive: true,
    createdAt: new Date(),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(mockCategories);
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [employees] = useState<Employee[]>(mockEmployees);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Product functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Category functions
  const addCategory = (category: Omit<ProductCategory, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<ProductCategory>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Promotion functions
  const addPromotion = (promotion: Omit<Promotion, 'id'>) => {
    const newPromotion = { ...promotion, id: Date.now().toString() };
    setPromotions(prev => [...prev, newPromotion]);
  };

  const updatePromotion = (id: string, promotion: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...promotion } : p));
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  // Order functions
  const addOrder = (order: Omit<Order, 'id' | 'orderNumber'>) => {
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder = { ...order, id: Date.now().toString(), orderNumber };
    setOrders(prev => [...prev, newOrder]);
    // Clear cart after creating order
    setCartItems([]);
  };

  const updateOrder = (id: string, order: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...order } : o));
  };

  // Enhanced Cart functions with notification
  const showCartNotification = (product: Product, quantity: number) => {
    // Create a custom notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 z-[60] bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl transform translate-x-full transition-all duration-500 animate-cartBounce';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
          </svg>
        </div>
        <div>
          <p class="font-bold text-sm">Đã thêm vào giỏ hàng!</p>
          <p class="text-green-100 text-xs">${quantity} x ${product.name}</p>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  const addToCart = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, product, quantity }];
    });

    // Show notification
    showCartNotification(product, quantity);
  };

  const updateCartItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Certificate functions
  const addCertificate = (certificate: Omit<Certificate, 'id'>) => {
    const newCertificate = { ...certificate, id: Date.now().toString() };
    setCertificates(prev => [...prev, newCertificate]);
  };

  const updateCertificate = (id: string, certificate: Partial<Certificate>) => {
    setCertificates(prev => prev.map(c => c.id === id ? { ...c, ...certificate } : c));
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
  };

  // User functions
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, user: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AppContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      promotions,
      addPromotion,
      updatePromotion,
      deletePromotion,
      orders,
      addOrder,
      updateOrder,
      cartItems,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      certificates,
      addCertificate,
      updateCertificate,
      deleteCertificate,
      employees,
      users,
      addUser,
      updateUser,
      deleteUser,
      showCartNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};