import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import LoginForm from './components/Auth/LoginForm';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import UserManagement from './components/Users/UserManagement';
import UnifiedProductsPage from './components/Products/UnifiedProductsPage';
import OrderList from './components/Orders/OrderList';
import PromotionList from './components/Promotions/PromotionList';
import CertificateManagement from './components/Certificates/CertificateManagement';
import SupportPage from './components/Support/SupportPage';
import ChatButton from './components/Chat/ChatButton';
import { 
  Percent, 
  Package, 
  FileText, 
  HelpCircle 
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'products':
        return <UnifiedProductsPage />;
      case 'orders':
        return <OrderList />;
      case 'promotions':
        return <PromotionList />;
      case 'certificates':
        return <CertificateManagement />;
      case 'support':
        return <SupportPage />;
      default:
        return <UnifiedProductsPage />;
    }
  };

  // Mobile bottom navigation items - Bỏ trang chủ
  const bottomNavItems = [
    { id: 'promotions', label: 'Khuyến mãi', icon: Percent, roles: ['admin', 'manager', 'employee'] },
    { id: 'products', label: 'Sản phẩm', icon: Package, roles: ['admin', 'manager', 'employee'] },
    { id: 'orders', label: 'Đơn hàng', icon: FileText, roles: ['admin', 'manager', 'employee'] },
    { id: 'support', label: 'Hỗ trợ', icon: HelpCircle, roles: ['admin', 'manager', 'employee'] },
  ];

  const canAccessItem = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isOpen={true}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute left-0 top-12 bottom-0" onClick={(e) => e.stopPropagation()}>
              <Sidebar 
                activeSection={activeSection}
                onSectionChange={(section) => {
                  setActiveSection(section);
                  setIsMobileMenuOpen(false);
                }}
                isOpen={true}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-0 lg:p-6 pb-16 lg:pb-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation - 4 tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
        <div className="grid grid-cols-4 h-14">
          {bottomNavItems.filter(item => canAccessItem(item.roles)).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center space-y-0.5 transition-all duration-200 ${
                  isActive 
                    ? 'text-[#007744] bg-green-50 scale-105' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Chat Button */}
      <ChatButton />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;