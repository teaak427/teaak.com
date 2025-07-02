import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import ProductForm from './ProductForm';
import CategoryForm from './CategoryForm';
import ProductPopup from './ProductPopup';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ShoppingCart,
  Eye,
  Tag,
  Grid,
  List,
  ToggleLeft,
  ToggleRight,
  Star,
  Heart,
  TrendingUp,
  Zap,
  AlertTriangle,
  Clock,
  Layers,
  Grid3X3
} from 'lucide-react';

const UnifiedProductsPage: React.FC = () => {
  const { products, categories, addToCart, deleteProduct, addProduct, updateProduct, addCategory, updateCategory, deleteCategory } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductPopup(true);
  };

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    addToCart(productId, quantity);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteProduct(productId);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const productCount = products.filter(product => product.category === categoryId).length;
    if (productCount > 0) {
      alert(`Không thể xóa nhóm sản phẩm này vì có ${productCount} sản phẩm đang sử dụng.`);
      return;
    }
    
    if (window.confirm('Bạn có chắc chắn muốn xóa nhóm sản phẩm này?')) {
      deleteCategory(categoryId);
    }
  };

  const handleToggleCategoryStatus = (categoryId: string, isActive: boolean) => {
    updateCategory(categoryId, { isActive: !isActive });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setEditingProduct(null);
  };

  const handleSaveCategory = (categoryData: any) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setEditingCategory(null);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCloseCategoryForm = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const handleCloseProductPopup = () => {
    setShowProductPopup(false);
    setSelectedProduct(null);
  };

  const getProductCount = (categoryId: string) => {
    return products.filter(product => product.category === categoryId).length;
  };

  const getCategoryIcon = (categoryName: string) => {
    if (categoryName.toLowerCase().includes('giảm đau')) return <Package size={20} className="text-red-600" />;
    if (categoryName.toLowerCase().includes('kháng sinh')) return <Grid3X3 size={20} className="text-blue-600" />;
    if (categoryName.toLowerCase().includes('vitamin')) return <Layers size={20} className="text-green-600" />;
    return <Tag size={20} className="text-gray-600" />;
  };

  const renderProductGrid = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      {filteredProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          {/* Product Image */}
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Overlay Actions - Desktop Only */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 lg:flex items-center justify-center opacity-0 group-hover:opacity-100 hidden">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#007744] hover:bg-[#007744] hover:text-white transition-colors shadow-lg"
                >
                  <ShoppingCart size={16} />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white transition-colors shadow-lg">
                  <Heart size={16} />
                </button>
              </div>
            </div>

            {/* Quick Badge */}
            <div className="absolute top-2 left-2">
              <span className="bg-[#007744] text-white px-2 py-1 text-xs font-bold rounded-full shadow-lg">
                Mới
              </span>
            </div>

            {/* Rating */}
            <div className="absolute top-2 right-2">
              <div className="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                <Star size={12} className="text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-900">4.8</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 lg:p-4">
            <div className="mb-3">
              <h3 className="font-bold text-gray-900 line-clamp-2 text-sm lg:text-base leading-tight mb-2 group-hover:text-[#007744] transition-colors">
                {product.name}
              </h3>
              <div className="space-y-1">
                <p className="text-xs text-gray-600 line-clamp-1">{product.activeIngredient}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{product.specification}</p>
              </div>
            </div>
            
            {/* Price Section */}
            <div className="space-y-2 mb-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-lg lg:text-xl font-bold text-[#007744]">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-xs text-gray-500 ml-1">/hộp</span>
                </div>
              </div>
              {product.pricePerUnit && (
                <div className="text-xs text-gray-600">
                  Giá/viên: {product.pricePerUnit.toLocaleString('vi-VN')}đ
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {/* Main Buy Button */}
              <button
                onClick={() => handleProductClick(product)}
                className="w-full bg-gradient-to-r from-[#007744] to-[#00aa55] text-white py-2.5 lg:py-3 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-bold text-sm lg:text-base shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={16} />
                <span>Chọn mua</span>
              </button>
              
              {/* Admin Actions */}
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle view
                    }}
                    className="flex-1 p-2 text-gray-600 hover:text-[#007744] hover:bg-green-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye size={14} className="mx-auto" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                    className="flex-1 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={14} className="mx-auto" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                    className="flex-1 p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={14} className="mx-auto" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductList = () => (
    <>
      {/* Mobile List View - Card Style */}
      <div className="lg:hidden space-y-3">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
            <div className="flex space-x-3">
              {/* Product Image */}
              <div className="relative flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div className="absolute -top-1 -right-1">
                  <div className="bg-white rounded-full p-1 shadow-md">
                    <Star size={10} className="text-yellow-500 fill-current" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-2">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="bg-[#007744] text-white px-2 py-0.5 text-xs font-bold rounded-full">
                      Mới
                    </span>
                    <span className="text-xs text-gray-500">4.8★</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-1 mb-2">
                  <p className="text-xs text-gray-600 line-clamp-1">
                    <span className="font-medium">Hoạt chất:</span> {product.activeIngredient}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    <span className="font-medium">Quy cách:</span> {product.specification}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-lg font-bold text-[#007744]">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="text-xs text-gray-500">/hộp</span>
                  </div>
                  {product.pricePerUnit && (
                    <div className="text-xs text-gray-600">
                      Giá/viên: {product.pricePerUnit.toLocaleString('vi-VN')}đ
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleProductClick(product)}
                    className="flex-1 bg-gradient-to-r from-[#007744] to-[#00aa55] text-white py-2 rounded-lg hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-bold text-xs flex items-center justify-center space-x-1"
                  >
                    <ShoppingCart size={12} />
                    <span>Chọn mua</span>
                  </button>

                  {/* Admin Actions */}
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {/* Handle view */}}
                        className="p-2 text-gray-600 hover:text-[#007744] hover:bg-green-50 rounded-lg transition-colors"
                        title="Xem"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star size={12} className="text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500">4.8</span>
                          <span className="bg-[#007744] text-white px-2 py-0.5 text-xs font-bold rounded-full ml-2">
                            Mới
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Hoạt chất:</span> {product.activeIngredient}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Quy cách:</span> {product.specification}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-[#007744]">
                        {product.price.toLocaleString('vi-VN')}đ
                        <span className="text-xs text-gray-500 ml-1 font-normal">/hộp</span>
                      </div>
                      {product.pricePerUnit && (
                        <div className="text-xs text-gray-600">
                          Giá/viên: {product.pricePerUnit.toLocaleString('vi-VN')}đ
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {/* Buy Button */}
                      <button
                        onClick={() => handleProductClick(product)}
                        className="bg-gradient-to-r from-[#007744] to-[#00aa55] text-white px-4 py-2 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-1"
                      >
                        <ShoppingCart size={14} />
                        <span>Chọn mua</span>
                      </button>

                      {/* Admin Actions */}
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
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-0">
      {/* Header - Compact */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý sản phẩm và nhóm sản phẩm</p>
        </div>
        
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCategoryForm(true)}
              className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm font-medium"
            >
              <Tag size={14} />
              <span>Thêm nhóm</span>
            </button>
            <button
              onClick={() => setShowProductForm(true)}
              className="bg-[#007744] text-white px-3 py-2 rounded-xl hover:bg-[#006633] transition-colors flex items-center space-x-1 text-sm font-medium"
            >
              <Plus size={14} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabs - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
              activeTab === 'products'
                ? 'bg-[#007744] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Package size={16} />
            <span>Sản phẩm ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
              activeTab === 'categories'
                ? 'bg-[#007744] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Tag size={16} />
            <span>Nhóm ({categories.length})</span>
          </button>
        </div>
      </div>

      {/* Filters - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={activeTab === 'products' ? 'Tìm kiếm sản phẩm...' : 'Tìm kiếm nhóm sản phẩm...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
            />
          </div>
          
          {activeTab === 'products' && (
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
              >
                <option value="">Tất cả nhóm</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* View Mode Toggle - Available on all devices */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#007744] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Dạng lưới"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#007744] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Dạng danh sách"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'products' ? (
        /* Products Content - Grid or List View */
        viewMode === 'grid' ? renderProductGrid() : renderProductList()
      ) : (
        /* Categories Content - Mobile Cards */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
          {filteredCategories.map((category) => {
            const productCount = getProductCount(category.id);
            const categoryIcon = getCategoryIcon(category.name);
            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {categoryIcon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-xs lg:text-sm mb-3">{category.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleCategoryStatus(category.id, category.isActive)}
                    className={`p-1 rounded-lg transition-colors ${
                      category.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={category.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  >
                    {category.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs lg:text-sm text-gray-600">Số sản phẩm:</span>
                    <span className="font-semibold text-[#007744]">{productCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
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
                        className="p-1.5 text-gray-600 hover:text-[#007744] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={12} />
                      </button>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'products' && filteredProducts.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <Package className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 lg:mb-4" />
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-sm lg:text-base text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {activeTab === 'categories' && filteredCategories.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <Tag className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 lg:mb-4" />
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhóm sản phẩm</h3>
          <p className="text-sm lg:text-base text-gray-600">Thử thay đổi từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Forms */}
      <ProductForm
        isOpen={showProductForm}
        onClose={handleCloseProductForm}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <CategoryForm
        isOpen={showCategoryForm}
        onClose={handleCloseCategoryForm}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      {/* Product Popup */}
      <ProductPopup
        product={selectedProduct}
        isOpen={showProductPopup}
        onClose={handleCloseProductPopup}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default UnifiedProductsPage;