# 🛣️ Roadmap: Từ Static Website đến PHP Backend

## 📍 Trạng thái hiện tại: Phase 1 - Static + Mock Data

✅ **Đã hoàn thành:**
- Frontend React + TypeScript hoàn chỉnh
- UI/UX responsive cho mobile + desktop
- Mock data với localStorage
- GitHub Pages deployment
- Authentication cơ bản (mock)
- Tất cả CRUD operations (mock)

## 🎯 Phase 2: PHP Backend Integration

### 2.1 Backend Setup (Tuần 1-2)

**Database Design:**
```sql
-- Core Tables
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    citizen_id VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'employee') NOT NULL,
    department VARCHAR(50),
    position VARCHAR(50),
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES product_categories(id)
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    price DECIMAL(12,0) NOT NULL,
    price_per_unit DECIMAL(12,0),
    image_url VARCHAR(255),
    active_ingredient VARCHAR(500),
    specification VARCHAR(500),
    stock INT DEFAULT 0,
    code VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES product_categories(id)
);
```

**PHP API Structure:**
```
api/
├── config/
│   ├── database.php      # Database connection
│   ├── cors.php         # CORS headers
│   └── auth.php         # JWT configuration
├── models/
│   ├── User.php
│   ├── Product.php
│   ├── Order.php
│   └── Promotion.php
├── controllers/
│   ├── AuthController.php
│   ├── ProductController.php
│   ├── OrderController.php
│   └── UserController.php
├── middleware/
│   ├── AuthMiddleware.php
│   └── CorsMiddleware.php
├── routes/
│   ├── api.php
│   └── web.php
└── index.php           # Entry point
```

### 2.2 API Endpoints (Tuần 2-3)

**Authentication:**
```php
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/profile
PUT  /api/auth/profile
```

**Products:**
```php
GET    /api/products              # List with pagination
GET    /api/products/{id}         # Get single product
POST   /api/products              # Create (admin/manager)
PUT    /api/products/{id}         # Update (admin/manager)
DELETE /api/products/{id}         # Delete (admin only)
GET    /api/products/categories   # List categories
```

**Orders:**
```php
GET    /api/orders                # List orders
GET    /api/orders/{id}           # Get order details
POST   /api/orders                # Create order
PUT    /api/orders/{id}/status    # Update status
```

### 2.3 Frontend API Integration (Tuần 3-4)

**Create API Service Layer:**
```typescript
// src/services/api.ts
class ApiService {
  private baseURL = 'https://api.fremed.com'; // Your PHP backend URL
  private token: string | null = null;

  async login(citizenId: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ citizen_id: citizenId, password })
    });
    return response.json();
  }

  async getProducts(page = 1, limit = 10) {
    const response = await fetch(`${this.baseURL}/products?page=${page}&limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }
}
```

**Update React Contexts:**
```typescript
// Replace mock data with API calls
const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };
};
```

### 2.4 File Upload & Media Management (Tuần 4)

**PHP Upload Handler:**
```php
// api/controllers/UploadController.php
class UploadController {
    public function uploadProductImage() {
        // Validate file type, size
        // Generate unique filename
        // Save to /uploads/products/
        // Return file URL
    }
}
```

**Frontend Upload Component:**
```typescript
const ImageUpload = ({ onUpload }) => {
  const handleFileChange = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/upload/product-image', {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const { url } = await response.json();
    onUpload(url);
  };
};
```

## 🚀 Phase 3: Advanced Features (Tuần 5-8)

### 3.1 Real-time Features
- **WebSocket/Server-Sent Events** cho notifications
- **Live chat** với Socket.IO hoặc pusher
- **Real-time inventory updates**

### 3.2 Advanced Analytics
- **Dashboard với charts** (Chart.js/D3.js)
- **Sales reports** theo khu vực, thời gian
- **Inventory tracking** và alerts

### 3.3 Mobile App (React Native)
- **Cross-platform app** cho iOS/Android
- **Offline sync** với SQLite
- **Push notifications**

### 3.4 Performance & Security
- **Redis caching**
- **CDN** cho static assets
- **Rate limiting**
- **Input validation & sanitization**
- **HTTPS & SSL certificates**

## 🏗️ Deployment Architecture

### Current (Phase 1):
```
GitHub Pages (Static) → Frontend React App
```

### Target (Phase 2+):
```
Frontend (Vercel/Netlify) ←→ PHP Backend (VPS/Shared Hosting)
                               ↓
                            MySQL Database
                               ↓
                         File Storage (S3/Local)
```

### Production Setup:
```
Load Balancer
    ↓
Frontend (CDN) ←→ API Gateway ←→ PHP Backend (Multiple instances)
                                      ↓
                                 MySQL Cluster
                                      ↓
                              Redis Cache + File Storage
```

## 📅 Timeline Estimate

| Phase | Duration | Effort | Priority |
|-------|----------|--------|----------|
| **Phase 1** (Current) | ✅ Complete | ✅ Done | High |
| **Phase 2.1** - Backend Setup | 2 tuần | Medium | High |
| **Phase 2.2** - API Development | 2 tuần | High | High |
| **Phase 2.3** - Frontend Integration | 2 tuần | Medium | High |
| **Phase 2.4** - File Upload | 1 tuần | Low | Medium |
| **Phase 3.1** - Real-time | 2 tuần | High | Medium |
| **Phase 3.2** - Analytics | 3 tuần | Medium | Low |
| **Phase 3.3** - Mobile App | 4 tuần | High | Low |
| **Phase 3.4** - Production | 2 tuần | Medium | High |

## 💰 Cost Estimate

### Development (Phase 2):
- **Hosting**: $5-20/month (VPS/Shared hosting)
- **Domain**: $10-15/year  
- **SSL Certificate**: Free (Let's Encrypt)
- **Database**: Included in hosting
- **Total**: ~$100-300/year

### Production (Phase 3):
- **Cloud hosting**: $50-200/month
- **CDN**: $10-50/month
- **Database cluster**: $50-100/month
- **Monitoring tools**: $20-50/month
- **Total**: $130-400/month

## 🔧 Tech Stack Summary

### Current:
- Frontend: React + TypeScript + Tailwind
- Build: Vite
- Deploy: GitHub Pages
- Data: localStorage (mock)

### Target:
- Frontend: Same + API integration
- Backend: PHP 8+ + MySQL/PostgreSQL
- Authentication: JWT
- File Storage: Local/S3
- Caching: Redis
- Deploy: VPS/Cloud (DigitalOcean/AWS)

---

🎯 **Next Steps**: Bắt đầu với Phase 2.1 - Database design và PHP backend setup! 