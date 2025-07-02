import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  HelpCircle,
  Search,
  Phone,
  Mail,
  Clock,
  MapPin,
  User,
  MessageCircle,
  Star,
  Headphones
} from 'lucide-react';

const SupportPage: React.FC = () => {
  const { employees } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.specialization.some(spec => 
                           spec.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const supportStats = [
    { label: 'Nhân viên', value: employees.length, icon: User },
    { label: 'Phòng ban', value: departments.length, icon: MapPin },
    { label: 'Trực tuyến', value: employees.filter(e => e.isAvailable).length, icon: Clock },
    { label: 'Đánh giá', value: '4.8/5', icon: Star },
  ];

  return (
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-0">
      {/* Header - Compact */}
      <div className="text-center">
        <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Trung tâm hỗ trợ</h1>
        <p className="text-sm text-gray-600 mt-1">Liên hệ với đội ngũ chuyên gia của Fremed</p>
      </div>

      {/* Stats - Compact grid */}
      <div className="grid grid-cols-4 gap-2 lg:gap-6">
        {supportStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6 text-center">
            <stat.icon className="mx-auto text-[#007744] mb-1 lg:mb-2" size={16} />
            <p className="text-sm lg:text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Contact - Compact */}
      <div className="bg-gradient-to-r from-[#007744] to-[#009955] rounded-xl p-4 lg:p-6 text-white">
        <div className="grid grid-cols-3 gap-3 lg:gap-6">
          <div className="text-center">
            <Phone className="mx-auto mb-1 lg:mb-2" size={16} />
            <h3 className="font-semibold mb-1 text-xs lg:text-base">Hotline</h3>
            <p className="text-xs lg:text-base">1800-1234</p>
            <p className="text-xs opacity-90">24/7</p>
          </div>
          <div className="text-center">
            <Mail className="mx-auto mb-1 lg:mb-2" size={16} />
            <h3 className="font-semibold mb-1 text-xs lg:text-base">Email</h3>
            <p className="text-xs lg:text-base">support@fremed.com</p>
            <p className="text-xs opacity-90">2 giờ</p>
          </div>
          <div className="text-center">
            <MessageCircle className="mx-auto mb-1 lg:mb-2" size={16} />
            <h3 className="font-semibold mb-1 text-xs lg:text-base">Live Chat</h3>
            <div className="flex items-center justify-center space-x-1">
              <Headphones size={12} />
              <span className="text-xs">Trực tuyến</span>
            </div>
            <p className="text-xs opacity-90 mt-1">Góc phải màn hình</p>
          </div>
        </div>
      </div>

      {/* Search and Filter - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
        <div className="space-y-2 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên hỗ trợ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
            />
          </div>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          >
            <option value="">Tất cả phòng ban</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Support Team - Compact cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-shadow">
            <div className="text-center mb-3">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#007744] rounded-full flex items-center justify-center text-white text-lg lg:text-xl font-bold mx-auto mb-2">
                {employee.name.charAt(0)}
              </div>
              <h3 className="text-sm lg:text-lg font-semibold text-gray-900">{employee.name}</h3>
              <p className="text-xs lg:text-sm text-gray-600">{employee.position}</p>
              <p className="text-xs text-gray-500">{employee.department}</p>
            </div>

            <div className="space-y-1 lg:space-y-2 mb-3">
              <div className="flex items-center space-x-2 text-xs lg:text-sm">
                <Mail className="text-gray-400 flex-shrink-0" size={12} />
                <span className="text-gray-900 truncate">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs lg:text-sm">
                <Phone className="text-gray-400 flex-shrink-0" size={12} />
                <span className="text-gray-900">{employee.phone}</span>
                {employee.extension && (
                  <span className="text-gray-500">ext. {employee.extension}</span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Chuyên môn:</p>
              <div className="flex flex-wrap gap-1">
                {employee.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#007744] bg-opacity-10 text-[#007744] text-xs rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  employee.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-xs text-gray-600">
                  {employee.isAvailable ? 'Trực tuyến' : 'Ngoại tuyến'}
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  className="p-1.5 text-[#007744] hover:bg-[#007744] hover:text-white rounded-lg transition-colors"
                  title="Gửi email"
                >
                  <Mail size={12} />
                </button>
                <button
                  className="p-1.5 text-[#007744] hover:bg-[#007744] hover:text-white rounded-lg transition-colors"
                  title="Gọi điện"
                >
                  <Phone size={12} />
                </button>
                <button
                  className="p-1.5 text-[#007744] hover:bg-[#007744] hover:text-white rounded-lg transition-colors"
                  title="Chat"
                >
                  <MessageCircle size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <HelpCircle className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 lg:mb-4" />
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy nhân viên hỗ trợ</h3>
          <p className="text-sm lg:text-base text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc phòng ban</p>
        </div>
      )}

      {/* FAQ Section - Compact */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
        <h2 className="text-base lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Câu hỏi thường gặp</h2>
        <div className="space-y-2 lg:space-y-3">
          {[
            {
              question: "Làm thế nào để đặt hàng?",
              answer: "Bạn có thể đặt hàng thông qua hệ thống nội bộ hoặc liên hệ trực tiếp với đội ngũ bán hàng."
            },
            {
              question: "Thời gian giao hàng là bao lâu?",
              answer: "Thời gian giao hàng thường từ 1-3 ngày làm việc tùy theo khu vực và loại sản phẩm."
            },
            {
              question: "Làm sao để kiểm tra tình trạng đơn hàng?",
              answer: "Bạn có thể kiểm tra tình trạng đơn hàng trong mục 'Quản lý đơn hàng' của hệ thống."
            }
          ].map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-3 lg:p-4">
              <h3 className="font-medium text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base">{faq.question}</h3>
              <p className="text-gray-600 text-xs lg:text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;