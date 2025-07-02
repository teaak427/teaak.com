import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Product } from '../../types';
import { X, Save, Upload, Package } from 'lucide-react';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: Omit<Product, 'id'>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, product, onSave }) => {
  const { categories } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    pricePerUnit: 0,
    image: '',
    activeIngredient: '',
    specification: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        pricePerUnit: product.pricePerUnit || 0,
        image: product.image,
        activeIngredient: product.activeIngredient,
        specification: product.specification,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        pricePerUnit: 0,
        image: 'https://images.pexels.com/photos/5863391/pexels-photo-5863391.jpeg',
        activeIngredient: '',
        specification: '',
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      pricePerUnit: formData.pricePerUnit || undefined,
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#007744] rounded-lg flex items-center justify-center">
                <Package className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.filter(c => c.isActive).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="Mô tả chi tiết sản phẩm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoạt chất *
                </label>
                <input
                  type="text"
                  name="activeIngredient"
                  value={formData.activeIngredient}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="Ví dụ: Paracetamol 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quy cách đóng gói *
                </label>
                <input
                  type="text"
                  name="specification"
                  value={formData.specification}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="Ví dụ: Hộp 10 vỉ x 10 viên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá bán 1 hộp (VNĐ) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá bán 1 viên (VNĐ)
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="Tùy chọn"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <Upload size={16} />
                    <span>Tải lên</span>
                  </button>
                </div>
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#007744] text-white rounded-lg hover:bg-[#006633] transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{product ? 'Cập nhật' : 'Thêm mới'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;