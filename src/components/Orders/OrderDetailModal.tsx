import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Order } from '../../types';
import { X, Download, Printer as Print, User, Phone, MapPin, Calendar, Package, CreditCard, FileText, Truck, CheckCircle } from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onExport: (orderId: string) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  order, 
  onExport 
}) => {
  const { products } = useApp();

  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã gửi hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Calendar size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#007744] rounded-xl flex items-center justify-center">
                <FileText className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
                <p className="text-sm text-gray-600">{order.orderNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onExport(order.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                <span>Xuất PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Print size={16} />
                <span>In</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h3>
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-medium">{getStatusText(order.status)}</span>
                </div>
              </div>
              
              {/* Timeline */}
              <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                {[
                  { key: 'pending', label: 'Chờ xử lý', icon: Calendar },
                  { key: 'processing', label: 'Đang xử lý', icon: Package },
                  { key: 'shipped', label: 'Đã gửi hàng', icon: Truck },
                  { key: 'delivered', label: 'Đã giao hàng', icon: CheckCircle },
                ].map((step, index) => {
                  const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index;
                  const isCurrent = order.status === step.key;
                  const StepIcon = step.icon;
                  
                  return (
                    <div key={step.key} className="flex items-center space-x-2 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-[#007744] text-white' : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-[#007744] ring-opacity-20' : ''}`}>
                        <StepIcon size={16} />
                      </div>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-[#007744]' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                      {index < 3 && (
                        <div className={`w-8 h-0.5 ${
                          ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) > index 
                            ? 'bg-[#007744]' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 text-[#007744]" size={20} />
                  Thông tin khách hàng
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <User className="text-gray-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">Tên khách hàng</p>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CreditCard className="text-gray-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">Mã khách hàng</p>
                      <p className="font-medium text-gray-900">{order.customerId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="text-gray-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">Số điện thoại</p>
                      <p className="font-medium text-gray-900">{order.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-gray-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                      <p className="font-medium text-gray-900">{order.customerAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="mr-2 text-[#007744]" size={20} />
                  Thông tin đơn hàng
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số đơn hàng:</span>
                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ngày đặt hàng:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số lượng sản phẩm:</span>
                    <span className="font-medium text-gray-900">{order.items.length} sản phẩm</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tổng số lượng:</span>
                    <span className="font-medium text-gray-900">
                      {order.items.reduce((total, item) => total + item.quantity, 0)} hộp
                    </span>
                  </div>
                  
                  {order.notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ghi chú:</p>
                      <p className="font-medium text-gray-900 text-sm bg-gray-50 p-2 rounded">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="mr-2 text-[#007744]" size={20} />
                Sản phẩm trong đơn hàng
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thông tin
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn giá
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => {
                      const productDetails = getProductDetails(item.productId);
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="flex items-center space-x-3">
                              {productDetails && (
                                <img
                                  src={productDetails.image}
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{item.productName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {productDetails && (
                              <div className="text-sm">
                                <p className="text-gray-600">Hoạt chất: {productDetails.activeIngredient}</p>
                                <p className="text-gray-600">Quy cách: {productDetails.specification}</p>
                                {productDetails.pricePerUnit && (
                                  <p className="text-gray-600">Giá/viên: {productDetails.pricePerUnit.toLocaleString('vi-VN')}đ</p>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="font-medium text-gray-900">{item.quantity} hộp</span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-medium text-gray-900">
                              {item.unitPrice.toLocaleString('vi-VN')}đ
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-semibold text-[#007744]">
                              {item.totalPrice.toLocaleString('vi-VN')}đ
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-[#007744] to-[#009955] rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="mr-2" size={20} />
                Tổng kết đơn hàng
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-100">Tổng tiền hàng:</span>
                  <span className="font-medium text-white text-lg">
                    {order.totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                
                {order.discountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Giảm giá:</span>
                    <span className="font-medium text-red-200 text-lg">
                      -{order.discountAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}
                
                <div className="border-t border-green-400 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Thành tiền:</span>
                    <span className="text-2xl font-bold text-white">
                      {order.finalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;