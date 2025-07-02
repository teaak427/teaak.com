import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import OrderForm from './OrderForm';
import OrderDetailModal from './OrderDetailModal';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Calendar,
  User,
  Package,
  FileText,
  Printer,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const OrderList: React.FC = () => {
  const { orders, updateOrder, addOrder } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái', icon: FileText },
    { value: 'pending', label: 'Chờ xử lý', icon: Clock },
    { value: 'processing', label: 'Đang xử lý', icon: Package },
    { value: 'shipped', label: 'Đã gửi hàng', icon: Truck },
    { value: 'delivered', label: 'Đã giao hàng', icon: CheckCircle },
    { value: 'cancelled', label: 'Đã hủy', icon: AlertTriangle },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || 
                       new Date(order.orderDate).toDateString() === new Date(dateFilter).toDateString();
    return matchesSearch && matchesStatus && matchesDate;
  });

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
      case 'pending': return <Clock size={12} />;
      case 'processing': return <Package size={12} />;
      case 'shipped': return <Truck size={12} />;
      case 'delivered': return <CheckCircle size={12} />;
      case 'cancelled': return <AlertTriangle size={12} />;
      default: return <FileText size={12} />;
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrder(orderId, { status: newStatus as any });
  };

  const handleExportOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Create a comprehensive order report
    const orderData = {
      orderInfo: {
        orderNumber: order.orderNumber,
        orderDate: new Date(order.orderDate).toLocaleDateString('vi-VN'),
        status: getStatusText(order.status),
      },
      customer: {
        name: order.customerName,
        id: order.customerId,
        phone: order.customerPhone,
        address: order.customerAddress,
      },
      items: order.items,
      summary: {
        totalAmount: order.totalAmount,
        discountAmount: order.discountAmount,
        finalAmount: order.finalAmount,
      },
      notes: order.notes || '',
    };

    // Generate PDF content
    const pdfContent = `
CÔNG TY CỔ PHẦN DƯỢC PHẨM FREMED
Địa chỉ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
Điện thoại: 1800-1234 | Email: info@fremed.com

=====================================
           HÓA ĐƠN BÁN HÀNG
=====================================

Số đơn hàng: ${orderData.orderInfo.orderNumber}
Ngày đặt: ${orderData.orderInfo.orderDate}
Trạng thái: ${orderData.orderInfo.status}

-------------------------------------
THÔNG TIN KHÁCH HÀNG
-------------------------------------
Tên khách hàng: ${orderData.customer.name}
Mã khách hàng: ${orderData.customer.id}
Số điện thoại: ${orderData.customer.phone}
Địa chỉ: ${orderData.customer.address}

-------------------------------------
CHI TIẾT SẢN PHẨM
-------------------------------------
${order.items.map((item, index) => `
${index + 1}. ${item.productName}
   Số lượng: ${item.quantity} hộp
   Đơn giá: ${item.unitPrice.toLocaleString('vi-VN')}đ
   Thành tiền: ${item.totalPrice.toLocaleString('vi-VN')}đ
`).join('')}

-------------------------------------
TỔNG KẾT
-------------------------------------
Tổng tiền hàng: ${orderData.summary.totalAmount.toLocaleString('vi-VN')}đ
Giảm giá: ${orderData.summary.discountAmount.toLocaleString('vi-VN')}đ
THÀNH TIỀN: ${orderData.summary.finalAmount.toLocaleString('vi-VN')}đ

${orderData.notes ? `Ghi chú: ${orderData.notes}` : ''}

=====================================
Cảm ơn quý khách đã sử dụng dịch vụ!
=====================================
    `;

    // Create and download the file
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Don_hang_${order.orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('Exporting order:', orderId);
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleSaveOrder = (orderData: any) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }
    setEditingOrder(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  // Stats calculations
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.finalAmount, 0);
  const todayOrders = filteredOrders.filter(order => 
    new Date(order.orderDate).toDateString() === new Date().toDateString()
  ).length;
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;
  const completedOrders = filteredOrders.filter(order => order.status === 'delivered').length;

  return (
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-0">
      {/* Header - Compact */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-600 mt-1">Theo dõi và quản lý đơn hàng khách hàng</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button 
            onClick={() => setShowForm(true)}
            className="w-full lg:w-auto bg-gradient-to-r from-[#007744] to-[#00aa55] text-white px-4 py-2.5 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={16} />
            <span>Tạo đơn hàng</span>
          </button>
        )}
      </div>

      {/* Stats - Compact grid */}
      <div className="grid grid-cols-4 gap-2 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <ShoppingCart className="mx-auto text-blue-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
            <p className="text-xs lg:text-sm text-gray-600">Tổng đơn</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <Clock className="mx-auto text-yellow-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-yellow-600">{pendingOrders}</p>
            <p className="text-xs lg:text-sm text-gray-600">Chờ xử lý</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-green-600">{completedOrders}</p>
            <p className="text-xs lg:text-sm text-gray-600">Hoàn thành</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <DollarSign className="mx-auto text-purple-600 mb-1 lg:mb-2" size={16} />
            <p className="text-sm lg:text-xl font-bold text-purple-600">{(totalRevenue/1000000).toFixed(1)}M</p>
            <p className="text-xs lg:text-sm text-gray-600">Doanh thu</p>
          </div>
        </div>
      </div>

      {/* Filters - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
        <div className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Orders List - Mobile Cards */}
      <div className="space-y-2 lg:hidden">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-bold text-gray-900 text-sm">{order.orderNumber}</p>
                  <span className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span>{getStatusText(order.status)}</span>
                  </span>
                </div>
                <p className="text-xs text-gray-500">{order.items.length} sản phẩm</p>
              </div>
              
              {(user?.role === 'admin' || user?.role === 'manager') && (
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#007744]"
                >
                  {statusOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-gray-600">
                  <User size={10} />
                  <span>Khách hàng:</span>
                </div>
                <span className="font-medium text-gray-900 truncate ml-2">{order.customerName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-gray-600">
                  <Calendar size={10} />
                  <span>Ngày đặt:</span>
                </div>
                <span className="text-gray-900">{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-gray-600">
                  <DollarSign size={10} />
                  <span>Tổng tiền:</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#007744]">{order.finalAmount.toLocaleString('vi-VN')}đ</span>
                  {order.discountAmount > 0 && (
                    <p className="text-xs text-gray-500">
                      Giảm: {order.discountAmount.toLocaleString('vi-VN')}đ
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1 text-xs text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded-full">{order.customerId}</span>
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="p-2 text-[#007744] hover:bg-[#007744] hover:text-white rounded-lg transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye size={12} />
                </button>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <>
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      onClick={() => handleExportOrder(order.id)}
                      className="p-2 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-colors"
                      title="Xuất đơn hàng"
                    >
                      <Download size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.items.length} sản phẩm</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="text-gray-400 mr-2" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.finalAmount.toLocaleString('vi-VN')}đ
                      </p>
                      {order.discountAmount > 0 && (
                        <p className="text-xs text-gray-500">
                          Giảm: {order.discountAmount.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(user?.role === 'admin' || user?.role === 'manager') ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full border focus:ring-2 focus:ring-[#007744] ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.slice(1).map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-[#007744] hover:text-[#006633] p-1"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      {(user?.role === 'admin' || user?.role === 'manager') && (
                        <>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleExportOrder(order.id)}
                            className="text-purple-600 hover:text-purple-900 p-1"
                            title="Xuất đơn hàng"
                          >
                            <Download size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="text-blue-600" size={32} />
          </div>
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#007744] to-[#00aa55] text-white px-6 py-3 rounded-xl hover:from-[#006633] hover:to-[#009944] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Plus size={16} />
              <span>Tạo đơn hàng đầu tiên</span>
            </button>
          )}
        </div>
      )}

      {/* Order Form Modal */}
      <OrderForm
        isOpen={showForm}
        onClose={handleCloseForm}
        order={editingOrder}
        onSave={handleSaveOrder}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        order={selectedOrder}
        onExport={handleExportOrder}
      />
    </div>
  );
};

export default OrderList;