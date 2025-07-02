import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Award,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Globe,
  MapPin,
  Building,
  TrendingUp
} from 'lucide-react';

const CertificateManagement: React.FC = () => {
  const { certificates, products, addCertificate, updateCertificate, deleteCertificate } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'Tất cả trạng thái', icon: FileText },
    { value: 'active', label: 'Còn hiệu lực', icon: CheckCircle },
    { value: 'expired', label: 'Đã hết hạn', icon: AlertTriangle },
    { value: 'pending', label: 'Chờ duyệt', icon: Clock },
  ];

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={12} />;
      case 'expired': return <AlertTriangle size={12} />;
      case 'pending': return <Clock size={12} />;
      default: return <FileText size={12} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Còn hiệu lực';
      case 'expired': return 'Đã hết hạn';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDeleteCertificate = (certId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giấy chứng nhận này?')) {
      deleteCertificate(certId);
    }
  };

  const handleDownload = (certId: string) => {
    const certificate = certificates.find(c => c.id === certId);
    if (!certificate) return;

    // Create certificate content
    const certContent = `
GIẤY CHỨNG NHẬN
=====================================

Tiêu đề: ${certificate.title}
Số chứng nhận: ${certificate.certificateNumber}
Cơ quan cấp: ${certificate.issuingAuthority}

Ngày cấp: ${new Date(certificate.issueDate).toLocaleDateString('vi-VN')}
Ngày hết hạn: ${new Date(certificate.expiryDate).toLocaleDateString('vi-VN')}

Mô tả:
${certificate.description}

Sản phẩm liên quan: ${certificate.relatedProducts.length} sản phẩm
Trạng thái: ${getStatusText(certificate.status)}

=====================================
Công ty Cổ phần Dược phẩm Fremed
    `;

    // Create and download the file
    const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chung_nhan_${certificate.certificateNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Stats calculations
  const activeCertificates = certificates.filter(c => c.status === 'active').length;
  const expiringSoon = certificates.filter(c => {
    const daysLeft = getDaysUntilExpiry(c.expiryDate);
    return daysLeft <= 90 && daysLeft > 0;
  }).length;
  const expiredCertificates = certificates.filter(c => c.status === 'expired').length;
  const pendingCertificates = certificates.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-0">
      {/* Header - Compact */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Quản lý giấy chứng nhận</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý các giấy chứng nhận và giấy phép dược phẩm</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button className="w-full lg:w-auto bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2.5 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
            <Plus size={16} />
            <span>Thêm chứng nhận</span>
          </button>
        )}
      </div>

      {/* Enhanced Stats - Compact grid */}
      <div className="grid grid-cols-4 gap-2 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6 hover:shadow-md transition-shadow">
          <div className="text-center">
            <Award className="mx-auto text-blue-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-gray-900">{certificates.length}</p>
            <p className="text-xs lg:text-sm text-gray-600">Tổng</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6 hover:shadow-md transition-shadow">
          <div className="text-center">
            <CheckCircle className="mx-auto text-green-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-green-600">{activeCertificates}</p>
            <p className="text-xs lg:text-sm text-gray-600">Hiệu lực</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6 hover:shadow-md transition-shadow">
          <div className="text-center">
            <AlertTriangle className="mx-auto text-orange-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-orange-600">{expiringSoon}</p>
            <p className="text-xs lg:text-sm text-gray-600">Sắp hết</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6 hover:shadow-md transition-shadow">
          <div className="text-center">
            <Clock className="mx-auto text-yellow-600 mb-1 lg:mb-2" size={16} />
            <p className="text-lg lg:text-2xl font-bold text-yellow-600">{pendingCertificates}</p>
            <p className="text-xs lg:text-sm text-gray-600">Chờ duyệt</p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
        <div className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm chứng nhận..."
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
        </div>
      </div>

      {/* Enhanced Certificates Grid - Mobile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-6">
        {filteredCertificates.map((certificate) => {
          const daysLeft = getDaysUntilExpiry(certificate.expiryDate);
          const isExpiringSoon = daysLeft <= 90 && daysLeft > 0;
          const status = getStatusColor(certificate.status);
          
          return (
            <div key={certificate.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award size={24} className="text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-[#007744] transition-colors">
                      {certificate.title}
                    </h3>
                    <p className="text-gray-600 text-xs lg:text-sm line-clamp-1 mt-1">{certificate.description}</p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full border ${status}`}>
                  {getStatusIcon(certificate.status)}
                  <span>{getStatusText(certificate.status)}</span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="space-y-3 mb-4">
                <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-3 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Shield size={14} className="text-[#007744]" />
                      <span className="text-sm font-medium text-gray-700">Số chứng nhận:</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{certificate.certificateNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building size={14} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Cơ quan cấp:</span>
                    </div>
                    <span className="text-sm text-gray-900 text-right flex-1 ml-2 truncate">{certificate.issuingAuthority}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <Calendar size={16} className="mx-auto text-blue-600 mb-1" />
                    <p className="text-xs text-gray-600">Ngày cấp</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(certificate.issueDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className={`text-center p-3 rounded-xl ${isExpiringSoon ? 'bg-orange-50' : 'bg-green-50'}`}>
                    <Clock size={16} className={`mx-auto mb-1 ${isExpiringSoon ? 'text-orange-600' : 'text-green-600'}`} />
                    <p className="text-xs text-gray-600">Ngày hết hạn</p>
                    <p className={`text-sm font-medium ${isExpiringSoon ? 'text-orange-900' : 'text-gray-900'}`}>
                      {new Date(certificate.expiryDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={14} className="text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Sản phẩm liên quan:</span>
                  </div>
                  <span className="text-sm font-bold text-purple-900">{certificate.relatedProducts.length} sản phẩm</span>
                </div>
              </div>

              {/* Warning for expiring certificates */}
              {isExpiringSoon && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3 mb-4">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-medium">
                      Chứng nhận sắp hết hạn trong {daysLeft} ngày
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDownload(certificate.id)}
                  className="flex items-center space-x-2 text-[#007744] hover:text-[#006633] text-sm font-medium hover:bg-green-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Download size={14} />
                  <span>Tải xuống</span>
                </button>

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
                      onClick={() => {/* Handle edit */}}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCertificate(certificate.id)}
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

      {/* Enhanced Empty State */}
      {filteredCertificates.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="text-orange-600" size={32} />
          </div>
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy giấy chứng nhận</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto">
              <Plus size={16} />
              <span>Thêm chứng nhận đầu tiên</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;