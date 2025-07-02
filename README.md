# Fremed Pharmaceutical Management System

![Fremed Logo](https://via.placeholder.com/300x100/007744/FFFFFF?text=FREMED)

## 🏥 Giới thiệu

Hệ thống quản lý nội bộ cho công ty dược phẩm Fremed, được xây dựng bằng React + TypeScript với giao diện hiện đại và responsive.

### 🌐 Demo Live

**GitHub Pages**: [https://yourusername.github.io/teaak.com](https://yourusername.github.io/teaak.com)

### 🔑 Tài khoản Demo

| Role | CCCD | Password | Tên |
|------|------|----------|-----|
| Admin | `079123456789` | `123456` | Nguyễn Văn Admin |
| Manager | `079987654321` | `123456` | Trần Thị Manager |
| Employee | `079555666777` | `123456` | Lê Văn Employee |

## ✨ Tính năng chính

### 🎯 Quản lý Sản phẩm Dược phẩm
- ✅ Danh sách sản phẩm với thông tin chi tiết (hoạt chất, quy cách, giá)
- ✅ Quản lý danh mục sản phẩm  
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Giao diện grid/list view
- ✅ Popup chi tiết sản phẩm

### 👥 Hệ thống Phân quyền
- **Admin**: Toàn quyền quản lý hệ thống
- **Manager**: Quản lý phòng ban và nhân viên
- **Employee**: Nhân viên cơ bản

### 📦 Quản lý Đơn hàng
- ✅ Tạo và theo dõi đơn hàng
- ✅ Thông tin khách hàng chi tiết
- ✅ Trạng thái đơn hàng (pending → delivered)
- ✅ Giỏ hàng với notification

### 🎁 Chương trình Khuyến mãi
- ✅ Khuyến mãi theo khu vực (Toàn quốc, Miền Bắc, Miền Trung, Miền Nam)
- ✅ Áp dụng cho sản phẩm cụ thể
- ✅ Quản lý thời gian và trạng thái

### 📋 Quản lý Chứng chỉ
- ✅ Chứng chỉ liên quan đến sản phẩm dược phẩm
- ✅ Theo dõi ngày hết hạn
- ✅ Upload và quản lý tài liệu

### 💬 Hỗ trợ & Chat
- ✅ Trang hỗ trợ khách hàng
- ✅ Live chat button
- ✅ Quản lý nhân viên hỗ trợ

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Deployment**: GitHub Pages

## 📱 Responsive Design

- **Desktop**: Sidebar + header đầy đủ
- **Mobile**: Bottom navigation 4 tabs + hamburger menu
- **Tablet**: Layout tối ưu cho tablet

## 🚀 Hướng dẫn chạy Local

### Yêu cầu hệ thống
- Node.js >= 18
- npm hoặc yarn

### Cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/teaak.com.git
cd teaak.com
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy development server:
```bash
npm run dev
```

4. Mở browser và truy cập: http://localhost:5173

### Build production

```bash
npm run build
```

## 🌐 Triển khai lên GitHub Pages

### Tự động (Recommended)

1. Push code lên GitHub repository
2. Vào **Settings** > **Pages** > **Source** chọn **GitHub Actions**
3. GitHub Actions sẽ tự động build và deploy

### Thủ công

```bash
npm run build
npm run preview
```

## 📂 Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication
│   ├── Layout/         # Layout components
│   ├── Products/       # Product management
│   ├── Orders/         # Order management
│   ├── Promotions/     # Promotion management
│   ├── Users/          # User management
│   ├── Certificates/   # Certificate management
│   ├── Support/        # Support system
│   └── Chat/           # Chat system
├── contexts/           # React Context
├── types/             # TypeScript interfaces
└── main.tsx          # Entry point
```

## 💾 Data Management

- **Mock Data**: Dữ liệu mẫu được lưu trong localStorage
- **Ready for API**: Cấu trúc sẵn sàng tích hợp PHP Backend
- **Type Safety**: TypeScript interfaces đầy đủ

## 🔮 Roadmap

### Phase 1: Current (Static + Mock Data)
- ✅ Frontend hoàn chỉnh
- ✅ GitHub Pages deployment
- ✅ Responsive design

### Phase 2: PHP Backend Integration
- 🔄 PHP REST API
- 🔄 MySQL Database
- 🔄 Authentication với JWT
- 🔄 File upload system

### Phase 3: Advanced Features
- ⏳ Real-time notifications
- ⏳ Advanced analytics
- ⏳ Mobile app (React Native)
- ⏳ PWA support

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Email**: contact@fremed.com
- **Website**: https://fremed.com
- **GitHub**: https://github.com/yourusername/teaak.com

---

🏥 **Fremed Pharmaceutical** - *Sức khỏe là vàng, chúng tôi là người thợ kim hoàn* 