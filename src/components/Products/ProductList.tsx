import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import ProductForm from './ProductForm';
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
  Grid,
  List,
  Star,
  Heart,
  TrendingUp
} from 'lucide-react';

const ProductList: React.FC = () => {
  const { products, categories, addToCart, deleteProduct, addProduct, updateProduct } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showForm, setShowForm] = useState(false);
  const [showProductPopup, setShowProductPopup] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setEditingProduct(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleCloseProductPopup = () => {
    setShowProductPopup(false);
    setSelectedProduct(null);
  };

  const renderGridView = () => (
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

  const renderListView = () => (
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
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Danh sách sản phẩm</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh sách sản phẩm dược phẩm</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full lg:w-auto bg-gradient-to-r from-[#007744] to-[#00aa55] text-white px-4 py-2.5 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={16} />
            <span>Thêm sản phẩm</span>
          </button>
        )}
      </div>

      {/* Stats - Compact grid */}
      <div className="grid grid-cols-4 gap-2 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Package className="mx-auto text-blue-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-gray-900">{products.length}</p>
            <p className="text-xs lg:text-sm text-gray-600">Tổng</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <ShoppingCart className="mx-auto text-green-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-green-600">
              {products.filter(p => p.isActive).length}
            </p>
            <p className="text-xs lg:text-sm text-gray-600">Đang bán</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <TrendingUp className="mx-auto text-orange-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-orange-600">
              {products.filter(p => p.stock < 50 && p.stock > 0).length}
            </p>
            <p className="text-xs lg:text-sm text-gray-600">Sắp hết</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Package className="mx-auto text-red-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-red-600">
              {products.filter(p => p.stock === 0).length}
            </p>
            <p className="text-xs lg:text-sm text-gray-600">Hết hàng</p>
          </div>
        </div>
      </div>

      {/* Filters - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
            />
          </div>
          
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
            
            {/* View Mode Toggle */}
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
        </div>
      </div>

      {/* Products Content */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="text-gray-400" size={32} />
          </div>
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#007744] to-[#00aa55] text-white px-6 py-3 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Plus size={16} />
              <span>Thêm sản phẩm đầu tiên</span>
            </button>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={showForm}
        onClose={handleCloseForm}
        product={editingProduct}
        onSave={handleSaveProduct}
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

export default ProductList;