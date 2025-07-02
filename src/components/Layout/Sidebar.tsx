import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Package,
  ShoppingCart,
  Tag,
  FileText,
  Users,
  HelpCircle,
  ChevronRight,
  Home,
  UserCheck,
  Award,
  Grid3X3,
  Percent,
  Search,
  User
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    id: 'products',
    label: 'Sản phẩm',
    icon: <Package size={20} />,
    roles: ['admin', 'manager', 'employee'],
  },
  {
    id: 'promotions',
    label: 'Khuyến mãi',
    icon: <Percent size={20} />,
    roles: ['admin', 'manager'],
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    icon: <FileText size={20} />,
    roles: ['admin', 'manager', 'employee'],
  },
  {
    id: 'certificates',
    label: 'Giấy chứng nhận',
    icon: <Award size={20} />,
    roles: ['admin', 'manager'],
  },
  {
    id: 'users',
    label: 'Quản lý người dùng',
    icon: <User size={20} />,
    roles: ['admin'],
  },
  {
    id: 'support',
    label: 'Hỗ trợ',
    icon: <HelpCircle size={20} />,
    roles: ['admin', 'manager', 'employee'],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, isOpen }) => {
  const { user } = useAuth();

  const canAccessItem = (item: MenuItem) => {
    return user && item.roles.includes(user.role);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!canAccessItem(item)) return null;

    const isActive = activeSection === item.id;

    return (
      <div key={item.id}>
        <button
          onClick={() => onSectionChange(item.id)}
          className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 rounded-xl mx-2 ${
            isActive
              ? 'bg-gradient-to-r from-[#007744] to-[#00aa55] text-white shadow-lg transform scale-105'
              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
          }`}
        >
          <div className={`p-1 rounded-lg ${isActive ? 'bg-white bg-opacity-20' : ''}`}>
            {item.icon}
          </div>
          {isOpen && <span className="text-sm font-medium">{item.label}</span>}
        </button>
      </div>
    );
  };

  return (
    <aside
      className={`bg-white shadow-xl transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } border-r border-gray-200 sticky top-12 lg:top-16 h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </aside>
  );
};

export default Sidebar;