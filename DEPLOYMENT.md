# 🚀 Hướng dẫn Triển khai lên GitHub Pages

## 📋 Checklist chuẩn bị

- ✅ Đã có tài khoản GitHub
- ✅ Đã cài đặt Node.js (>= 18) và npm
- ✅ Đã cài đặt Git

## 🛠️ Bước 1: Cài đặt Node.js (nếu chưa có)

### Windows:
1. Tải Node.js từ: https://nodejs.org/
2. Chọn phiên bản LTS (Long Term Support)
3. Chạy file installer và làm theo hướng dẫn
4. Khởi động lại Command Prompt/PowerShell
5. Kiểm tra: `node --version` và `npm --version`

### macOS:
```bash
# Sử dụng Homebrew
brew install node

# Hoặc tải từ nodejs.org
```

### Linux (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🔧 Bước 2: Setup Local

1. **Clone hoặc tải source code về máy**:
```bash
# Nếu có Git
git clone https://github.com/yourusername/teaak.com.git
cd teaak.com

# Hoặc tải ZIP và giải nén
```

2. **Cài đặt dependencies**:
```bash
npm install
```

3. **Test chạy local**:
```bash
npm run dev
```
→ Mở http://localhost:5173 để xem website

4. **Test build production**:
```bash
npm run build
npm run preview
```

## 🌐 Bước 3: Tạo GitHub Repository

1. **Tạo repository mới trên GitHub**:
   - Repository name: `teaak.com`
   - Chọn **Public** (bắt buộc cho GitHub Pages miễn phí)
   - ✅ Add README file
   - ✅ Add .gitignore (Node)

2. **Upload code lên GitHub**:

### Cách 1: Sử dụng Git CLI
```bash
# Nếu chưa init git
git init
git remote add origin https://github.com/YOURUSERNAME/teaak.com.git

# Add và commit files
git add .
git commit -m "Initial commit - Fremed Pharmaceutical System"
git branch -M main
git push -u origin main
```

### Cách 2: Sử dụng GitHub Desktop
1. Tải GitHub Desktop: https://desktop.github.com/
2. Clone repository đã tạo
3. Copy source code vào folder
4. Commit và push

### Cách 3: Upload trực tiếp trên GitHub.com
1. Vào repository vừa tạo
2. Click "uploading an existing file"
3. Drag & drop tất cả files (trừ node_modules)
4. Commit changes

## ⚙️ Bước 4: Cấu hình GitHub Pages

1. **Vào repository Settings**:
   - Repository → Settings → Pages (sidebar bên trái)

2. **Chọn Source**:
   - Source: **GitHub Actions** (khuyến nghị)
   - Hoặc Source: **Deploy from a branch** → **main** → **/ (root)**

3. **Nếu chọn GitHub Actions**:
   - GitHub sẽ tự động phát hiện file `.github/workflows/deploy.yml`
   - Workflow sẽ tự động chạy khi có push mới

## 🔄 Bước 5: Cập nhật cấu hình

### 5.1 Cập nhật vite.config.ts
```typescript
// Thay 'teaak.com' bằng tên repository thực tế
base: '/YOUR_REPOSITORY_NAME/',
```

### 5.2 Cập nhật package.json
```json
{
  "homepage": "https://YOURUSERNAME.github.io/YOUR_REPOSITORY_NAME"
}
```

### 5.3 Cập nhật README.md
```markdown
**Demo Live**: [https://YOURUSERNAME.github.io/YOUR_REPOSITORY_NAME](https://YOURUSERNAME.github.io/YOUR_REPOSITORY_NAME)
```

## 🚀 Bước 6: Deploy

### Tự động (GitHub Actions):
1. Push code lên GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Vào tab **Actions** trong repository để xem tiến trình build

3. Sau khi build thành công, website sẽ có tại:
   `https://YOURUSERNAME.github.io/REPOSITORY_NAME`

### Thủ công (nếu cần):
```bash
npm run build
npm run deploy
```

## 🔍 Bước 7: Kiểm tra và Test

1. **Truy cập URL**:
   `https://YOURUSERNAME.github.io/teaak.com`

2. **Test các tính năng**:
   - ✅ Login với tài khoản demo
   - ✅ Navigate giữa các trang
   - ✅ Responsive trên mobile
   - ✅ Các chức năng CRUD

3. **Test tài khoản**:
   | Role | CCCD | Password |
   |------|------|----------|
   | Admin | `079123456789` | `123456` |
   | Manager | `079987654321` | `123456` |
   | Employee | `079555666777` | `123456` |

## 🐛 Troubleshooting

### Lỗi thường gặp:

**1. 404 Page Not Found**
```bash
# Kiểm tra base URL trong vite.config.ts
base: '/exact-repository-name/',
```

**2. Blank page hoặc JS errors**
```bash
# Kiểm tra console.log browser
# Thường do path không đúng
```

**3. Build failed**
```bash
# Chạy local để check lỗi
npm run build

# Xem chi tiết lỗi trong GitHub Actions
```

**4. CSS không load**
```bash
# Kiểm tra tailwind.config.js
# Đảm bảo paths đúng
```

## 🔄 Update và Maintenance

### Cập nhật code:
```bash
# Sửa code local
npm run dev  # Test local

# Push lên GitHub
git add .
git commit -m "Update feature X"
git push origin main

# GitHub Actions sẽ tự động deploy
```

### Xem logs:
- GitHub → Repository → Actions
- Click vào run gần nhất để xem chi tiết

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check GitHub Actions logs
2. Verify file paths và naming
3. Test build local trước khi push
4. Kiểm tra GitHub Pages settings

---

🎉 **Chúc mừng!** Website của bạn đã được deploy thành công lên GitHub Pages! 