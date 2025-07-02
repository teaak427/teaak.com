import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import PromotionForm from './PromotionForm';
import {
  Tag,
  Plus,
  Search,
  Calendar,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Image,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Globe
} from 'lucide-react';

const PromotionList: React.FC = () => {
  const { promotions, deletePromotion, addPromotion, updatePromotion } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  const regions = [
    { value: '', label: 'Tất cả khu vực', icon: Globe },
    { value: 'nationwide', label: 'Toàn quốc', icon: Globe },
    { value: 'north', label: 'Miền Bắc', icon: MapPin },
    { value: 'central', label: 'Miền Trung', icon: MapPin },
    { value: 'south', label: 'Miền Nam', icon: MapPin },
  ];

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'expired', label: 'Đã hết hạn' },
    { value: 'inactive', label: 'Tạm dừng' },
  ];

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);
    
    let matchesStatus = true;
    if (statusFilter) {
      if (statusFilter === 'active') {
        matchesStatus = promotion.isActive && startDate <= now && endDate >= now;
      } else if (statusFilter === 'upcoming') {
        matchesStatus = promotion.isActive && startDate > now;
      } else if (statusFilter === 'expired') {
        matchesStatus = endDate < now;
      } else if (statusFilter === 'inactive') {
        matchesStatus = !promotion.isActive;
      }
    }
    
    const matchesRegion = !regionFilter || promotion.region === regionFilter;
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const handleDeletePromotion = (promotionId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này?')) {
      deletePromotion(promotionId);
    }
  };

  const handleEditPromotion = (promotion: any) => {
    setEditingPromotion(promotion);
    setShowForm(true);
  };

  const handleSavePromotion = (promotionData: any) => {
    if (editingPromotion) {
      updatePromotion(editingPromotion.id, promotionData);
    } else {
      addPromotion(promotionData);
    }
    setEditingPromotion(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPromotion(null);
  };

  const getPromotionStatus = (promotion: any) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return { 
        text: 'Tạm dừng', 
        color: 'bg-gray-100 text-gray-800',
        icon: <AlertTriangle size={12} />
      };
    }
    if (endDate < now) {
      return { 
        text: 'Đã hết hạn', 
        color: 'bg-red-100 text-red-800',
        icon: <Clock size={12} />
      };
    }
    if (startDate > now) {
      return { 
        text: 'Sắp diễn ra', 
        color: 'bg-blue-100 text-blue-800',
        icon: <Calendar size={12} />
      };
    }
    return { 
      text: 'Đang hoạt động', 
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={12} />
    };
  };

  const getRegionInfo = (region: string) => {
    const regionMap = {
      'nationwide': { label: 'Toàn quốc', color: 'bg-blue-100 text-blue-800' },
      'north': { label: 'Miền Bắc', color: 'bg-green-100 text-green-800' },
      'central': { label: 'Miền Trung', color: 'bg-yellow-100 text-yellow-800' },
      'south': { label: 'Miền Nam', color: 'bg-orange-100 text-orange-800' },
    };
    return regionMap[region] || { label: region, color: 'bg-gray-100 text-gray-800' };
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Stats calculations
  const activePromotions = promotions.filter(p => {
    const now = new Date();
    return p.isActive && new Date(p.startDate) <= now && new Date(p.endDate) >= now;
  }).length;

  const upcomingPromotions = promotions.filter(p => {
    const now = new Date();
    return p.isActive && new Date(p.startDate) > now;
  }).length;

  const expiredPromotions = promotions.filter(p => {
    const now = new Date();
    return new Date(p.endDate) < now;
  }).length;

  return (
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-0">
      {/* Header - Compact */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Chương trình khuyến mãi</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý các chương trình khuyến mãi theo khu vực</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button 
            onClick={() => setShowForm(true)}
            className="w-full lg:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={16} />
            <span>Thêm khuyến mãi</span>
          </button>
        )}
      </div>

      {/* Stats - Compact grid */}
      <div className="grid grid-cols-4 gap-2 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Tag className="mx-auto text-purple-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-gray-900">{promotions.length}</p>
            <p className="text-xs lg:text-sm text-gray-600">Tổng</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-green-600">{activePromotions}</p>
            <p className="text-xs lg:text-sm text-gray-600">Hoạt động</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Calendar className="mx-auto text-blue-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-blue-600">{upcomingPromotions}</p>
            <p className="text-xs lg:text-sm text-gray-600">Sắp tới</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Clock className="mx-auto text-red-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-red-600">{expiredPromotions}</p>
            <p className="text-xs lg:text-sm text-gray-600">Hết hạn</p>
          </div>
        </div>
      </div>

      {/* Filters - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
        <div className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm chương trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          >
            {regions.map(region => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Promotions Grid - Mobile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6">
        {filteredPromotions.map((promotion) => {
          const status = getPromotionStatus(promotion);
          const regionInfo = getRegionInfo(promotion.region);
          const daysRemaining = getDaysRemaining(promotion.endDate);
          
          return (
            <div key={promotion.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              {/* Image */}
              <div className="relative h-32 lg:h-48 overflow-hidden">
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay badges */}
                <div className="absolute top-2 left-2">
                  <span className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${status.color} shadow-lg backdrop-blur-sm`}>
                    {status.icon}
                    <span>{status.text}</span>
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${regionInfo.color} shadow-lg backdrop-blur-sm`}>
                    {regionInfo.label}
                  </span>
                </div>

                {/* Days remaining badge */}
                {status.text === 'Đang hoạt động' && daysRemaining <= 7 && daysRemaining > 0 && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-orange-500 text-white px-2 py-1 text-xs rounded-full shadow-lg backdrop-blur-sm">
                      Còn {daysRemaining} ngày
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 lg:p-6">
                <div className="mb-3">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#007744] transition-colors">
                    {promotion.title}
                  </h3>
                  <p className="text-gray-600 text-xs lg:text-sm line-clamp-2">
                    {promotion.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Calendar size={12} />
                      <span>Bắt đầu:</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {new Date(promotion.startDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock size={12} />
                      <span>Kết thúc:</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs lg:text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Tag size={12} />
                      <span>Sản phẩm:</span>
                    </div>
                    <span className="text-gray-900 font-medium">{promotion.applicableProducts.length} sản phẩm</span>
                  </div>
                </div>

                {/* Progress bar for active promotions */}
                {status.text === 'Đang hoạt động' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Tiến độ</span>
                      <span>{Math.max(0, Math.min(100, ((new Date().getTime() - new Date(promotion.startDate).getTime()) / (new Date(promotion.endDate).getTime() - new Date(promotion.startDate).getTime())) * 100)).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#007744] to-[#00aa55] h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max(0, Math.min(100, ((new Date().getTime() - new Date(promotion.startDate).getTime()) / (new Date(promotion.endDate).getTime() - new Date(promotion.startDate).getTime())) * 100))}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div className="flex justify-end space-x-1 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => {/* Handle view */}}
                      className="p-2 text-gray-600 hover:text-[#007744] hover:bg-green-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEditPromotion(promotion)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promotion.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredPromotions.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="text-purple-600" size={32} />
          </div>
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy chương trình khuyến mãi</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Plus size={16} />
              <span>Tạo chương trình đầu tiên</span>
            </button>
          )}
        </div>
      )}

      {/* Promotion Form Modal */}
      <PromotionForm
        isOpen={showForm}
        onClose={handleCloseForm}
        promotion={editingPromotion}
        onSave={handleSavePromotion}
      />
    </div>
  );
};

export default PromotionList;