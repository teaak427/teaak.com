# 🎮 Hướng dẫn Test Demo - Fremed Pharmaceutical System

## 🌐 Demo Live URL
**[https://yourusername.github.io/teaak.com](https://yourusername.github.io/teaak.com)**

## 🔑 Tài khoản Demo

| Role | CCCD | Password | Quyền truy cập |
|------|------|----------|----------------|
| **Admin** | `079123456789` | `123456` | Toàn bộ hệ thống |
| **Manager** | `079987654321` | `123456` | Quản lý cơ bản |
| **Employee** | `079555666777` | `123456` | Xem và tạo đơn |

## 📱 Test trên Devices

### Desktop (Khuyến nghị)
- **Chrome/Firefox/Safari** trên laptop/desktop
- Màn hình tối thiểu: 1280x720
- Test đầy đủ tất cả tính năng

### Mobile
- **iOS Safari/Chrome** hoặc **Android Chrome**
- Test responsive và navigation
- Đặc biệt chú ý **bottom navigation** 4 tabs

### Tablet
- **iPad/Android Tablet** landscape và portrait
- Test adaptive layout

## 🧪 Test Scenarios

### 🔐 1. Authentication & Authorization

**Test Admin:**
```
1. Vào website
2. Login: CCCD = 079123456789, Password = 123456
3. ✅ Check: Sidebar hiển thị đầy đủ menu items
4. ✅ Check: Có thể truy cập "Quản lý người dùng"
5. ✅ Check: Header hiển thị "Nguyễn Văn Admin"
```

**Test Employee (quyền hạn chế):**
```
1. Logout → Login: CCCD = 079555666777, Password = 123456
2. ✅ Check: Sidebar ẩn một số menu items
3. ✅ Check: Không thể truy cập "Quản lý người dùng"
4. ✅ Check: Header hiển thị "Lê Văn Employee"
```

### 🏪 2. Quản lý Sản phẩm

**Browse Products:**
```
1. Click "Sản phẩm" trong sidebar/bottom nav
2. ✅ Check: Hiển thị grid/list view toggle
3. ✅ Check: 6 sản phẩm mẫu hiển thị
4. Test tìm kiếm: Gõ "Paracetamol"
5. ✅ Check: Lọc được sản phẩm đúng
6. Test filter category: Chọn "Thuốc giảm đau"
7. ✅ Check: Hiển thị đúng sản phẩm theo category
```

**Product Detail:**
```
1. Click vào sản phẩm "Paracetamol 500mg"
2. ✅ Check: Popup hiển thị thông tin chi tiết
3. ✅ Check: Hiển thị hoạt chất, quy cách, giá
4. Test "Thêm vào giỏ": Click button, nhập số lượng
5. ✅ Check: Notification hiển thị
6. ✅ Check: Cart badge tăng số lượng
```

**Add/Edit Product (Admin only):**
```
1. Login bằng Admin account
2. Vào "Sản phẩm" → Click "Thêm sản phẩm"
3. Fill form: Tên, mô tả, category, giá, etc.
4. ✅ Check: Validation hoạt động
5. Submit → ✅ Check: Sản phẩm mới xuất hiện
6. Test Edit: Click icon edit → Update info
7. ✅ Check: Thông tin được cập nhật
```

### 🛒 3. Shopping Cart & Orders

**Cart Management:**
```
1. Thêm vài sản phẩm vào cart từ trang products
2. Click cart icon trên header
3. ✅ Check: Cart modal hiển thị items
4. Test quantity update: Tăng/giảm số lượng
5. ✅ Check: Tổng tiền tự động update
6. Test remove item: Click trash icon
7. ✅ Check: Item bị xóa khỏi cart
```

**Create Order:**
```
1. Có items trong cart
2. Click "Tạo đơn hàng" trong cart modal
3. Fill form khách hàng: Tên, SĐT, địa chỉ
4. ✅ Check: Order items hiển thị đúng
5. Submit → ✅ Check: Order được tạo
6. Vào "Đơn hàng" → ✅ Check: Order mới xuất hiện
```

### 🎁 4. Promotions

**View Promotions:**
```
1. Click "Khuyến mãi" 
2. ✅ Check: Hiển thị list promotions
3. ✅ Check: Hiển thị khu vực áp dụng (Toàn quốc, Miền Bắc, etc.)
4. ✅ Check: Ngày bắt đầu/kết thúc
5. Test search: Tìm "Flash Sale"
6. ✅ Check: Filter hoạt động
```

**Add Promotion (Admin only):**
```
1. Login Admin → "Khuyến mãi" → "Thêm khuyến mãi"
2. Fill: Title, description, date range, region
3. Select applicable products
4. ✅ Check: Form validation
5. Submit → ✅ Check: Promotion mới xuất hiện
```

### 👥 5. User Management (Admin only)

**View Users:**
```
1. Login Admin → "Quản lý người dùng"
2. ✅ Check: Hiển thị table với 3 users
3. ✅ Check: Hiển thị role, department, status
4. Test search: Tìm theo tên hoặc email
5. ✅ Check: Filter hoạt động
```

**Add/Edit User:**
```
1. Click "Thêm người dùng"
2. Fill form: CCCD, name, email, role, etc.
3. ✅ Check: CCCD validation (12 số)
4. ✅ Check: Email validation
5. Submit → ✅ Check: User mới xuất hiện
6. Test edit: Update role từ Employee → Manager
7. ✅ Check: Thay đổi được lưu
```

### 📋 6. Certificates

**View Certificates:**
```
1. Click "Chứng chỉ"
2. ✅ Check: Hiển thị danh sách certificates
3. ✅ Check: Status (active/expired/pending)
4. ✅ Check: Related products links
5. Test search: Tìm theo certificate number
```

### 💬 7. Support & Chat

**Support Page:**
```
1. Click "Hỗ trợ"
2. ✅ Check: Hiển thị support categories
3. ✅ Check: Employee contact info
4. ✅ Check: FAQ section
5. Test contact form: Fill và submit
6. ✅ Check: Success message
```

**Live Chat:**
```
1. Click chat button (floating bottom right)
2. ✅ Check: Chat window mở
3. Type message và send
4. ✅ Check: Message hiển thị
5. ✅ Check: Auto-reply hoạt động
```

## 📱 Mobile-Specific Tests

### Bottom Navigation
```
1. Mở trên mobile
2. ✅ Check: 4 tabs bottom: Khuyến mãi, Sản phẩm, Đơn hàng, Hỗ trợ
3. Test navigate: Click từng tab
4. ✅ Check: Active state highlighting
5. ✅ Check: Icons và labels rõ ràng
```

### Hamburger Menu
```
1. Click hamburger icon (top left)
2. ✅ Check: Sidebar overlay hiển thị
3. ✅ Check: Menu items theo role
4. Test navigation: Click menu item
5. ✅ Check: Sidebar tự động đóng
6. Test close: Click outside overlay
```

### Touch Interactions
```
1. Test scroll: Danh sách products
2. Test swipe: Nếu có carousel
3. Test touch: Buttons và form inputs
4. ✅ Check: Touch target size đủ lớn (44px+)
5. ✅ Check: Hover states hoạt động
```

## 🐛 Common Issues to Check

### Performance
```
✅ Page load < 3 seconds
✅ Smooth animations
✅ No layout shift (CLS)
✅ Images load progressively
```

### Accessibility  
```
✅ Tab navigation hoạt động
✅ Screen reader friendly
✅ Color contrast đạt chuẩn
✅ Focus indicators rõ ràng
```

### Browser Compatibility
```
✅ Chrome (latest)
✅ Firefox (latest) 
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers
```

### Data Persistence
```
✅ Login state giữ nguyên khi refresh
✅ Cart items không bị mất
✅ Form data restore khi back
✅ Settings được save
```

## 📊 Test Results Template

```
Device: [Desktop/Mobile/Tablet]
Browser: [Chrome/Firefox/Safari/etc.]
Screen: [1920x1080/iPhone 12/etc.]

✅ Authentication: Pass/Fail
✅ Product Management: Pass/Fail  
✅ Shopping Cart: Pass/Fail
✅ Orders: Pass/Fail
✅ Promotions: Pass/Fail
✅ User Management: Pass/Fail
✅ Certificates: Pass/Fail
✅ Support: Pass/Fail
✅ Mobile Navigation: Pass/Fail
✅ Performance: Pass/Fail

Issues Found:
- [Describe any bugs/issues]

Overall Rating: ⭐⭐⭐⭐⭐ (1-5 stars)
```

## 🚀 Performance Benchmarks

### Expected Metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s  
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Speed Index**: < 3.0s

### Tools to test:
- **Lighthouse** (Chrome DevTools)
- **PageSpeed Insights**
- **WebPageTest**
- **GTmetrix**

---

🎯 **Happy Testing!** Nếu gặp bug hoặc có feedback, vui lòng tạo issue trên GitHub repository. 