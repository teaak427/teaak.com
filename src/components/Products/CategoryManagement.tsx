import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import CategoryForm from './CategoryForm';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Grid3X3,
  Layers
} from 'lucide-react';

const CategoryManagement: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductCount = (categoryId: string) => {
    return products.filter(product => product.category === categoryId).length;
  };

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.toLowerCase().includes('giảm đau')) return <Package size={20} className="text-red-600" />;
    if (categoryName.toLowerCase().includes('kháng sinh')) return <Grid3X3 size={20} className="text-blue-600" />;
    if (categoryName.toLowerCase().includes('vitamin')) return <Layers size={20} className="text-green-600" />;
    return <Tag size={20} className="text-gray-600" />;
  };

  const handleToggleStatus = (categoryId: string, isActive: boolean) => {
    updateCategory(categoryId, { isActive: !isActive });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const productCount = getProductCount(categoryId);
    if (productCount > 0) {
      alert(`Không thể xóa nhóm sản phẩm này vì có ${productCount} sản phẩm đang sử dụng.`);
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa nhóm sản phẩm này?')) {
      deleteCategory(categoryId);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setEditingCategory(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-0">
      {/* Header - Compact */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Quản lý nhóm sản phẩm</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh mục và phân loại sản phẩm</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={16} />
            <span>Thêm nhóm sản phẩm</span>
          </button>
        )}
      </div>

      {/* Stats - Compact grid */}
      <div className="grid grid-cols-3 gap-2 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Tag className="mx-auto text-blue-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-xs lg:text-sm text-gray-600">Tổng nhóm</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Package className="mx-auto text-green-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-green-600">
              {categories.filter(c => c.isActive).length}
            </p>
            <p className="text-xs lg:text-sm text-gray-600">Hoạt động</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <TrendingUp className="mx-auto text-purple-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-purple-600">{products.length}</p>
            <p className="text-xs lg:text-sm text-gray-600">Sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Search - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm nhóm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Categories Grid - Mobile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
        {filteredCategories.map((category) => {
          const productCount = getProductCount(category.id);
          const categoryIcon = getCategoryIcon(category.name);
          
          return (
            <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {categoryIcon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1 group-hover:text-[#007744] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-xs lg:text-sm line-clamp-2">{category.description}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleToggleStatus(category.id, category.isActive)}
                  className={`p-1 rounded-lg transition-colors ${
                    category.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title={category.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                >
                  {category.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package size={16} className="text-[#007744]" />
                    <span className="text-sm text-gray-600">Sản phẩm:</span>
                  </div>
                  <span className="text-xl font-bold text-[#007744]">{productCount}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </span>

                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {/* Handle view */}}
                      className="p-2 text-gray-600 hover:text-[#007744] hover:bg-green-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
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

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="text-gray-400" size={32} />
          </div>
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhóm sản phẩm</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4">Thử thay đổi từ khóa tìm kiếm</p>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Plus size={16} />
              <span>Tạo nhóm sản phẩm đầu tiên</span>
            </button>
          )}
        </div>
      )}

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showForm}
        onClose={handleCloseForm}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default CategoryManagement;