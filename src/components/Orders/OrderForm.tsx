import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Order, OrderItem } from '../../types';
import { X, Save, Plus, Minus, Trash2, ShoppingCart, User, Phone, MapPin } from 'lucide-react';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
  onSave: (order: Omit<Order, 'id' | 'orderNumber'>) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, order, onSave }) => {
  const { products, promotions } = useApp();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [] as OrderItem[],
    notes: '',
    status: 'pending' as Order['status'],
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (order) {
      setFormData({
        customerId: order.customerId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerAddress: order.customerAddress,
        items: order.items,
        notes: order.notes || '',
        status: order.status,
      });
    } else {
      setFormData({
        customerId: '',
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        items: [],
        notes: '',
        status: 'pending',
      });
    }
  }, [order]);

  const addProductToOrder = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItemIndex = formData.items.findIndex(item => item.productId === selectedProduct);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += quantity;
      updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * product.price;
      
      setFormData(prev => ({ ...prev, items: updatedItems }));
    } else {
      const newItem: OrderItem = {
        productId: selectedProduct,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice: quantity * product.price,
      };
      
      setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    }
    
    setSelectedProduct('');
    setQuantity(1);
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }
    
    const updatedItems = [...formData.items];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].totalPrice = newQuantity * updatedItems[index].unitPrice;
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const calculateTotals = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = 0; // Calculate based on promotions if needed
    const finalAmount = totalAmount - discountAmount;
    
    return { totalAmount, discountAmount, finalAmount };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      alert('Vui lòng điền đầy đủ thông tin khách hàng');
      return;
    }
    
    if (formData.items.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng');
      return;
    }
    
    const { totalAmount, discountAmount, finalAmount } = calculateTotals();
    
    onSave({
      ...formData,
      totalAmount,
      discountAmount,
      finalAmount,
      orderDate: new Date(),
      createdBy: user?.id || '1',
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  const { totalAmount, discountAmount, finalAmount } = calculateTotals();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#007744] rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {order ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới'}
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
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="mr-2 text-[#007744]" size={20} />
                Thông tin khách hàng
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã khách hàng *
                  </label>
                  <input
                    type="text"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                    placeholder="CUST001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                      placeholder="0123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái đơn hàng
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="shipped">Đã gửi hàng</option>
                    <option value="delivered">Đã giao hàng</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ giao hàng *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                    <textarea
                      name="customerAddress"
                      value={formData.customerAddress}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                      placeholder="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Add Products */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm sản phẩm</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.filter(p => p.isActive && p.stock > 0).map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price.toLocaleString('vi-VN')}đ (Còn: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                    placeholder="Số lượng"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={addProductToOrder}
                    disabled={!selectedProduct}
                    className="w-full px-4 py-2 bg-[#007744] text-white rounded-lg hover:bg-[#006633] transition-colors disabled:bg-gray-300 flex items-center justify-center space-x-2"
                  >
                    <Plus size={16} />
                    <span>Thêm</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm trong đơn hàng</h3>
              {formData.items.length > 0 ? (
                <div className="space-y-3">
                  {formData.items.map((item, index) => {
                    const product = products.find(p => p.id === item.productId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 flex-1">
                          {product && (
                            <img
                              src={product.image}
                              alt={item.productName}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            {product && (
                              <div className="text-xs text-gray-600">
                                <p>Hoạt chất: {product.activeIngredient}</p>
                                <p>Quy cách: {product.specification}</p>
                              </div>
                            )}
                            <p className="text-sm text-gray-600">
                              {item.unitPrice.toLocaleString('vi-VN')}đ x {item.quantity} = {item.totalPrice.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-gray-900 rounded"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(index, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-gray-900 rounded"
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1 text-red-600 hover:text-red-900 rounded ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Chưa có sản phẩm nào trong đơn hàng</p>
              )}
            </div>

            {/* Order Summary */}
            {formData.items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng kết đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng tiền hàng:</span>
                    <span className="font-medium">{totalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-medium text-red-600">-{discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Thành tiền:</span>
                    <span className="text-[#007744]">{finalAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                placeholder="Ghi chú thêm cho đơn hàng"
              />
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
                disabled={formData.items.length === 0}
                className="px-6 py-2 bg-[#007744] text-white rounded-lg hover:bg-[#006633] transition-colors flex items-center space-x-2 disabled:bg-gray-300"
              >
                <Save size={16} />
                <span>{order ? 'Cập nhật' : 'Tạo đơn hàng'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;