import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Search, X, Package, ShoppingCart, Tag, Award, Filter } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { products, orders, promotions, certificates } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'Tất cả', icon: Search },
    { id: 'products', label: 'Sản phẩm', icon: Package },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    { id: 'promotions', label: 'Khuyến mãi', icon: Tag },
    { id: 'certificates', label: 'Chứng nhận', icon: Award },
  ];

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const searchResults = [];
    const term = searchTerm.toLowerCase();

    // Search products
    if (activeFilter === 'all' || activeFilter === 'products') {
      const productResults = products
        .filter(p => 
          p.name.toLowerCase().includes(term) || 
          p.code.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
        )
        .slice(0, 5)
        .map(p => ({ ...p, type: 'product' }));
      searchResults.push(...productResults);
    }

    // Search orders
    if (activeFilter === 'all' || activeFilter === 'orders') {
      const orderResults = orders
        .filter(o => 
          o.orderNumber.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term)
        )
        .slice(0, 3)
        .map(o => ({ ...o, type: 'order' }));
      searchResults.push(...orderResults);
    }

    // Search promotions
    if (activeFilter === 'all' || activeFilter === 'promotions') {
      const promotionResults = promotions
        .filter(p => 
          p.title.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
        )
        .slice(0, 3)
        .map(p => ({ ...p, type: 'promotion' }));
      searchResults.push(...promotionResults);
    }

    // Search certificates
    if (activeFilter === 'all' || activeFilter === 'certificates') {
      const certificateResults = certificates
        .filter(c => 
          c.title.toLowerCase().includes(term) ||
          c.certificateNumber.toLowerCase().includes(term)
        )
        .slice(0, 3)
        .map(c => ({ ...c, type: 'certificate' }));
      searchResults.push(...certificateResults);
    }

    setResults(searchResults);
  }, [searchTerm, activeFilter, products, orders, promotions, certificates]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'product': return <Package size={16} className="text-green-600" />;
      case 'order': return <ShoppingCart size={16} className="text-blue-600" />;
      case 'promotion': return <Tag size={16} className="text-purple-600" />;
      case 'certificate': return <Award size={16} className="text-orange-600" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product': return 'Sản phẩm';
      case 'order': return 'Đơn hàng';
      case 'promotion': return 'Khuyến mãi';
      case 'certificate': return 'Chứng nhận';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-4 pt-16">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-100">
            <Search className="text-gray-400 mr-3" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, đơn hàng, khuyến mãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-lg border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2 p-4 border-b border-gray-100 overflow-x-auto">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeFilter === filter.id
                      ? 'bg-[#007744] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((item, index) => (
                  <button
                    key={`${item.type}-${item.id}-${index}`}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    onClick={() => {
                      // Handle navigation to item
                      onClose();
                    }}
                  >
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name || item.title || item.orderNumber}
                        </p>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {getTypeLabel(item.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {item.description || item.customerName || item.code || item.certificateNumber}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm.trim() ? (
              <div className="p-8 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-600">Thử sử dụng từ khóa khác hoặc thay đổi bộ lọc</p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tìm kiếm nhanh</h3>
                <p className="text-gray-600">Nhập từ khóa để tìm kiếm sản phẩm, đơn hàng, khuyến mãi...</p>
                
                {/* Quick suggestions */}
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {['Paracetamol', 'Vitamin C', 'Đơn hàng mới', 'Flash Sale'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchTerm(suggestion)}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;