import React, { useState, useEffect } from 'react';
import { ProductCategory } from '../../types';
import { X, Save, Tag, Image, Upload } from 'lucide-react';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ProductCategory | null;
  onSave: (category: Omit<ProductCategory, 'id'>) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, category, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  const departments = [
    'IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 
    'Warehouse', 'Quality Control', 'Research & Development'
  ];

  const roles = [
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'manager', label: 'Quản lý' },
    { value: 'employee', label: 'Nhân viên' },
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        isActive: category.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-scaleIn">
          {/* Header - Minimalist */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Tag className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {category ? 'Chỉnh sửa nhóm' : 'Thêm nhóm mới'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Category Icon Preview */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Tag size={32} className="text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Icon sẽ được tự động gán cho nhóm</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên nhóm sản phẩm *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent transition-all"
                placeholder="Ví dụ: Thuốc giảm đau"
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
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent transition-all resize-none"
                placeholder="Mô tả chi tiết về nhóm sản phẩm này..."
              />
            </div>

            {/* Status Toggle */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-gray-900">Kích hoạt nhóm sản phẩm</span>
                  <p className="text-xs text-gray-500 mt-1">Nhóm sản phẩm sẽ hiển thị trong danh sách</p>
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

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#007744] to-[#00aa55] text-white rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Save size={16} />
                <span>{category ? 'Cập nhật' : 'Tạo nhóm'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;