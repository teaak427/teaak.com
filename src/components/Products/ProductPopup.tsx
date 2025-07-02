import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Check, Sparkles, Heart, Star } from 'lucide-react';

interface ProductPopupProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (productId: string, quantity: number) => void;
}

const ProductPopup: React.FC<ProductPopupProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !product) return null;

  const handleQuantityChange = (change: number) => {
    const newQty = Math.max(1, quantity + change);
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Add to cart
    onAddToCart(product.id, quantity);
    
    // Show adding animation
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      
      // Auto close after success animation
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setQuantity(1);
      }, 2000);
    }, 800);
  };

  // Auto calculate prices based on quantity
  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex min-h-screen items-end justify-center lg:items-center lg:p-4">
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-sm bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden animate-slideInUp">
          {/* Enhanced Success State */}
          {showSuccess && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center z-10">
              <div className="text-center text-white animate-scaleIn">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm animate-bounce">
                    <Check size={40} className="text-white animate-checkmark" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles size={24} className="text-yellow-300 animate-pulse" />
                  </div>
                  <div className="absolute -bottom-2 -left-2">
                    <Sparkles size={20} className="text-yellow-200 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">Đã thêm vào giỏ!</h3>
                <p className="text-green-100 text-lg font-medium">{quantity} x {product.name}</p>
                <p className="text-green-200 text-sm mt-2">Tổng: {totalPrice.toLocaleString('vi-VN')}đ</p>
                
                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full opacity-70 animate-bounce"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAdding && (
            <div className="absolute inset-0 bg-[#007744] bg-opacity-95 flex items-center justify-center z-10">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-xl font-bold mb-2">Đang thêm vào giỏ...</h3>
                <p className="text-green-100">Vui lòng chờ trong giây lát</p>
              </div>
            </div>
          )}

          {/* Drag Handle - Mobile */}
          <div className="lg:hidden flex justify-center pt-2 pb-1">
            <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Enhanced Close Button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Enhanced Product Image */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-xl"
              />
              
              {/* Product badges */}
              <div className="absolute top-2 left-2 flex space-x-2">
                <span className="bg-[#007744] text-white px-2 py-1 text-xs font-bold rounded-full shadow-lg">
                  Mới
                </span>
                <div className="bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-xs font-medium text-gray-900">4.8</span>
                </div>
              </div>

              {/* Wishlist button */}
              <button className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors shadow-lg">
                <Heart size={16} />
              </button>
            </div>

            {/* Enhanced Product Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{product.activeIngredient}</p>
                  <p className="text-sm text-gray-600">{product.specification}</p>
                </div>
              </div>

              {/* Enhanced Unit Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Đơn vị mua:</span>
                  <span className="text-sm font-bold text-blue-900">Hộp</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-blue-700">Còn lại:</span>
                  <span className="text-xs font-medium text-blue-700">{product.stock || 50} hộp</span>
                </div>
              </div>

              {/* Enhanced Quantity Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Số lượng:</span>
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-gray-900 transition-all hover:scale-105 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <div className="w-16 text-center">
                      <span className="font-bold text-2xl text-gray-900">{quantity}</span>
                    </div>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-gray-600 hover:text-gray-900 transition-all hover:scale-105"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Enhanced Price Display */}
                <div className="bg-gradient-to-r from-[#007744] to-[#00aa55] text-white p-4 rounded-2xl shadow-lg">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-green-100 text-sm">Đơn giá:</span>
                      <span className="text-lg font-bold">{product.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-green-400 pt-3">
                      <span className="text-white font-medium">Tạm tính:</span>
                      <span className="text-2xl font-bold text-white">{totalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {product.pricePerUnit && (
                      <div className="text-center border-t border-green-400 pt-2">
                        <span className="text-green-200 text-xs">
                          Giá/viên: {product.pricePerUnit.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    )}
                    
                    {/* Savings indicator */}
                    {quantity > 1 && (
                      <div className="bg-white bg-opacity-20 rounded-lg p-2 text-center">
                        <span className="text-green-100 text-xs">
                          Mua {quantity} hộp • Tiết kiệm được {(quantity * 1000).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Action Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || showSuccess}
                className="w-full bg-gradient-to-r from-[#007744] to-[#00aa55] text-white py-4 rounded-2xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 relative overflow-hidden"
              >
                {isAdding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang thêm...</span>
                  </>
                ) : showSuccess ? (
                  <>
                    <Check size={20} />
                    <span>Đã thêm!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Thêm vào giỏ hàng</span>
                  </>
                )}
                
                {/* Ripple effect */}
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity rounded-2xl"></div>
              </button>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>🚚 Giao hàng miễn phí từ 500.000đ</span>
                  <span>📞 Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopup;