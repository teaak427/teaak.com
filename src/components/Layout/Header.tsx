import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import SearchModal from './SearchModal';
import CartModal from './CartModal';
import { 
  User, 
  LogOut, 
  ShoppingCart, 
  Bell, 
  Search,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      {/* Mobile Header - Tối ưu compact */}
      <header className="lg:hidden bg-[#007744] sticky top-0 z-40 shadow-lg">
        <div className="px-3 py-2">
          {/* Single Row Layout - Compact */}
          <div className="flex items-center justify-between">
            {/* Left: Menu + Logo */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onMenuToggle}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-white font-bold text-base">Fremed</span>
              </div>
            </div>
            
            {/* Right: Search + Notifications + Cart */}
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <Search size={18} />
              </button>
              
              <button className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <Bell size={18} />
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  3
                </span>
              </button>
              
              <button 
                onClick={() => setShowCartModal(true)}
                className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <ShoppingCart size={18} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center ml-4 lg:ml-0">
                <div className="w-8 h-8 bg-[#007744] rounded-lg flex items-center justify-center text-white font-bold mr-3">
                  F
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Fremed</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Pharmaceutical Company</p>
                </div>
              </div>
            </div>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, đơn hàng..."
                  onClick={() => setShowSearchModal(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent cursor-pointer"
                  readOnly
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search */}
              <button 
                onClick={() => setShowSearchModal(true)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <div className="relative">
                <button 
                  onClick={() => setShowCartModal(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingCart size={20} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell size={20} />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-[#007744] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.position}</p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Handle profile click
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <User size={16} className="mr-2" />
                      Thông tin cá nhân
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut size={16} className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
    </>
  );
};

export default Header;