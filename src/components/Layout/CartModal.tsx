import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { X, Plus, Minus, Trash2, ShoppingCart, User, Phone, MapPin, CreditCard, ArrowLeft, Package, Truck, Gift, Percent } from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateCartItem, removeFromCart, clearCart, addOrder, promotions } = useApp();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    notes: ''
  });
  const [selectedPromotion, setSelectedPromotion] = useState<string>('');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  
  // Calculate discount from promotion
  const activePromotion = promotions.find(p => p.id === selectedPromotion);
  const discountAmount = activePromotion ? Math.floor(subtotal * 0.1) : 0; // 10% discount example
  
  // Calculate delivery fee
  const deliveryFee = deliveryOption === 'express' ? 50000 : (subtotal >= 500000 ? 0 : 30000);
  
  const totalAmount = subtotal - discountAmount + deliveryFee;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
  };

  const handleCreateOrder = () => {
    if (!customerInfo.customerId || !customerInfo.customerName || !customerInfo.customerPhone || !customerInfo.customerAddress) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }

    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity
    }));

    addOrder({
      customerId: customerInfo.customerId,
      customerName: customerInfo.customerName,
      customerPhone: customerInfo.customerPhone,
      customerAddress: customerInfo.customerAddress,
      items: orderItems,
      totalAmount: subtotal,
      discountAmount,
      finalAmount: totalAmount,
      status: 'pending',
      orderDate: new Date(),
      notes: customerInfo.notes,
      createdBy: user?.id || '1'
    });

    alert('Đơn hàng đã được tạo thành công!');
    setShowCheckout(false);
    setCustomerInfo({
      customerId: '',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      notes: ''
    });
    setSelectedPromotion('');
    clearCart();
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const availablePromotions = promotions.filter(p => {
    const now = new Date();
    return p.isActive && new Date(p.startDate) <= now && new Date(p.endDate) >= now;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-[#007744] to-[#00aa55] text-white">
            <div className="flex items-center space-x-3">
              {showCheckout && (
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <div className="flex items-center space-x-2">
                <ShoppingCart size={20} />
                <h2 className="text-lg font-bold">
                  {showCheckout ? 'Thông tin đặt hàng' : `Giỏ hàng (${cartItems.length})`}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {!showCheckout ? (
            <>
              {/* Enhanced Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                            />
                            <div className="absolute -top-2 -right-2 bg-[#007744] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                              {item.quantity}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{item.product.name}</h3>
                            <p className="text-xs text-gray-600 mb-2">{item.product.activeIngredient}</p>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-bold text-[#007744]">
                                  {item.product.price.toLocaleString('vi-VN')}đ
                                </p>
                                <p className="text-xs text-gray-500">x {item.quantity} = {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center bg-white rounded-lg border border-gray-200">
                                  <button
                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-lg transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="px-3 py-2 font-bold text-sm min-w-[40px] text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-lg transition-colors"
                                    disabled={item.quantity >= item.product.stock}
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Promotions Section */}
                    {availablePromotions.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <Gift className="text-purple-600" size={16} />
                          <h3 className="font-bold text-purple-900">Khuyến mãi có sẵn</h3>
                        </div>
                        <div className="space-y-2">
                          {availablePromotions.slice(0, 2).map((promotion) => (
                            <label key={promotion.id} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="radio"
                                name="promotion"
                                value={promotion.id}
                                checked={selectedPromotion === promotion.id}
                                onChange={(e) => setSelectedPromotion(e.target.value)}
                                className="text-purple-600 focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-purple-900">{promotion.title}</p>
                                <p className="text-xs text-purple-700">Giảm 10% - Áp dụng đến {new Date(promotion.endDate).toLocaleDateString('vi-VN')}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
                    <p className="text-gray-600">Thêm sản phẩm vào giỏ hàng để tiếp tục</p>
                  </div>
                )}
              </div>

              {/* Enhanced Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-100 p-4 space-y-4 bg-white">
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tạm tính:</span>
                        <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Giảm giá:</span>
                          <span className="font-medium text-green-600">-{discountAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phí giao hàng:</span>
                        <span className="font-medium">{deliveryFee === 0 ? 'Miễn phí' : `${deliveryFee.toLocaleString('vi-VN')}đ`}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                          <span className="text-xl font-bold text-[#007744]">
                            {totalAmount.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-[#007744] to-[#00aa55] text-white py-3 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Tiến hành đặt hàng
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full border border-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Enhanced Checkout Form */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <User className="mr-2 text-[#007744]" size={18} />
                      Thông tin khách hàng
                    </h3>
                    
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="customerId"
                        value={customerInfo.customerId}
                        onChange={handleInputChange}
                        placeholder="Mã khách hàng *"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                        required
                      />
                      
                      <input
                        type="text"
                        name="customerName"
                        value={customerInfo.customerName}
                        onChange={handleInputChange}
                        placeholder="Tên khách hàng *"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                        required
                      />
                      
                      <input
                        type="tel"
                        name="customerPhone"
                        value={customerInfo.customerPhone}
                        onChange={handleInputChange}
                        placeholder="Số điện thoại *"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                        required
                      />
                      
                      <textarea
                        name="customerAddress"
                        value={customerInfo.customerAddress}
                        onChange={handleInputChange}
                        placeholder="Địa chỉ giao hàng *"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent resize-none"
                        required
                      />
                      
                      <textarea
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleInputChange}
                        placeholder="Ghi chú (tùy chọn)"
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Truck className="mr-2 text-[#007744]" size={18} />
                      Phương thức giao hàng
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="delivery"
                          value="standard"
                          checked={deliveryOption === 'standard'}
                          onChange={(e) => setDeliveryOption(e.target.value as 'standard')}
                          className="text-[#007744] focus:ring-[#007744]"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Giao hàng tiêu chuẩn</p>
                          <p className="text-sm text-gray-600">2-3 ngày làm việc • {subtotal >= 500000 ? 'Miễn phí' : '30.000đ'}</p>
                        </div>
                      </label>
                      
                      <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-white transition-colors">
                        <input
                          type="radio"
                          name="delivery"
                          value="express"
                          checked={deliveryOption === 'express'}
                          onChange={(e) => setDeliveryOption(e.target.value as 'express')}
                          className="text-[#007744] focus:ring-[#007744]"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Giao hàng nhanh</p>
                          <p className="text-sm text-gray-600">Trong ngày • 50.000đ</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-r from-[#007744] to-[#00aa55] rounded-2xl p-4 text-white">
                    <h3 className="font-bold mb-4 flex items-center">
                      <Package className="mr-2" size={18} />
                      Tóm tắt đơn hàng
                    </h3>
                    
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-green-100">
                            {item.product.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      ))}
                      
                      <div className="border-t border-green-400 pt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-100">Tạm tính:</span>
                          <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-green-100">Giảm giá:</span>
                            <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-green-100">Phí giao hàng:</span>
                          <span>{deliveryFee === 0 ? 'Miễn phí' : `${deliveryFee.toLocaleString('vi-VN')}đ`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t border-green-400 pt-2">
                          <span>Tổng cộng:</span>
                          <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Footer */}
              <div className="border-t border-gray-100 p-4 space-y-2 bg-white">
                <button
                  onClick={handleCreateOrder}
                  className="w-full bg-gradient-to-r from-[#007744] to-[#00aa55] text-white py-3 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Xác nhận đặt hàng • {totalAmount.toLocaleString('vi-VN')}đ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;