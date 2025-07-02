import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Promotion } from '../../types';
import { X, Save, Calendar, Package, Upload, MapPin, Image, Tag, Globe } from 'lucide-react';

interface PromotionFormProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: Promotion | null;
  onSave: (promotion: Omit<Promotion, 'id'>) => void;
}

const PromotionForm: React.FC<PromotionFormProps> = ({ isOpen, onClose, promotion, onSave }) => {
  const { products } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    startDate: '',
    endDate: '',
    applicableProducts: [] as string[],
    region: 'nationwide' as Promotion['region'],
    isActive: true,
    createdBy: '1',
  });

  const regions = [
    { value: 'nationwide', label: 'Toàn quốc', color: 'bg-blue-100 text-blue-800', icon: Globe },
    { value: 'north', label: 'Miền Bắc', color: 'bg-green-100 text-green-800', icon: MapPin },
    { value: 'central', label: 'Miền Trung', color: 'bg-yellow-100 text-yellow-800', icon: MapPin },
    { value: 'south', label: 'Miền Nam', color: 'bg-orange-100 text-orange-800', icon: MapPin },
  ];

  useEffect(() => {
    if (promotion) {
      setFormData({
        title: promotion.title,
        description: promotion.description,
        image: promotion.image,
        startDate: promotion.startDate.toISOString().split('T')[0],
        endDate: promotion.endDate.toISOString().split('T')[0],
        applicableProducts: promotion.applicableProducts,
        region: promotion.region,
        isActive: promotion.isActive,
        createdBy: promotion.createdBy,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image: 'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg',
        startDate: '',
        endDate: '',
        applicableProducts: [],
        region: 'nationwide',
        isActive: true,
        createdBy: '1',
      });
    }
  }, [promotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleProductSelection = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      applicableProducts: prev.applicableProducts.includes(productId)
        ? prev.applicableProducts.filter(id => id !== productId)
        : [...prev.applicableProducts, productId]
    }));
  };

  if (!isOpen) return null;

  const selectedRegion = regions.find(r => r.value === formData.region);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-scaleIn">
          {/* Header - Minimalist */}
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Tag className="text-white" size={20} />
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                {promotion ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {/* Image Upload Section - Compact */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4 flex items-center">
                <Image className="mr-2 text-[#007744]" size={18} />
                Hình ảnh chương trình
              </h3>
              
              <div className="space-y-3 lg:space-y-4">
                {/* Current Image Preview */}
                {formData.image && (
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-32 lg:h-48 object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL hình ảnh
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề chương trình *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
                  placeholder="Flash Sale Thuốc Giảm Đau"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm resize-none"
                  placeholder="Mô tả chi tiết về chương trình khuyến mãi"
                />
              </div>

              {/* Region Selection - Compact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Khu vực áp dụng *
                </label>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  {regions.map(region => {
                    const IconComponent = region.icon;
                    return (
                      <label
                        key={region.value}
                        className={`relative flex items-center justify-center p-3 lg:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.region === region.value
                            ? 'border-[#007744] bg-green-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="region"
                          value={region.value}
                          checked={formData.region === region.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <IconComponent size={20} className="mx-auto mb-1 text-gray-600" />
                          <div className="text-xs lg:text-sm font-medium text-gray-700">
                            {region.label}
                          </div>
                          {formData.region === region.value && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-[#007744] rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
                {selectedRegion && (
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedRegion.color}`}>
                      <MapPin size={14} className="mr-1" />
                      Áp dụng cho {selectedRegion.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Date Range - Compact */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Product Selection - Compact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sản phẩm áp dụng
                </label>
                <div className="border border-gray-200 rounded-xl p-3 max-h-40 lg:max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {products.filter(p => p.isActive).map(product => (
                      <label key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.applicableProducts.includes(product.id)}
                          onChange={() => handleProductSelection(product.id)}
                          className="rounded border-gray-300 text-[#007744] focus:ring-[#007744]"
                        />
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate">{product.activeIngredient}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Đã chọn: {formData.applicableProducts.length} sản phẩm
                </p>
              </div>

              {/* Status Toggle - Compact */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-medium text-gray-900">Kích hoạt chương trình</span>
                    <p className="text-xs text-gray-500 mt-1">Chương trình sẽ hiển thị công khai</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      formData.isActive ? 'bg-[#007744]' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}></div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex space-x-3 pt-4 lg:pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 lg:py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm lg:text-base"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 lg:py-3 bg-gradient-to-r from-[#007744] to-[#00aa55] text-white rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 text-sm lg:text-base"
              >
                <Save size={16} />
                <span>{promotion ? 'Cập nhật' : 'Tạo chương trình'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionForm;