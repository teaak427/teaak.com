import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { X, Save, User as UserIcon, Shield, Mail, Phone } from 'lucide-react';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSave: (user: Omit<User, 'id'>) => void;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    citizenId: '',
    name: '',
    email: '',
    role: 'employee' as User['role'],
    department: '',
    position: '',
    isActive: true,
  });

  const departments = [
    'IT', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 
    'Warehouse', 'Quality Control', 'Research & Development'
  ];

  const roles = [
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'manager', label: 'Quản lý' },
    { value: 'employee', label: 'Nhân viên' },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        citizenId: user.citizenId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        isActive: user.isActive,
      });
    } else {
      setFormData({
        citizenId: '',
        name: '',
        email: '',
        role: 'employee',
        department: '',
        position: '',
        isActive: true,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      createdAt: new Date(),
    });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#007744] rounded-lg flex items-center justify-center">
                <UserIcon className="text-white" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số căn cước công dân *
                </label>
                <input
                  type="text"
                  name="citizenId"
                  value={formData.citizenId}
                  onChange={handleChange}
                  required
                  maxLength={12}
                  pattern="[0-9]{12}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="079123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                    placeholder="user@fremed.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò *
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phòng ban *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                >
                  <option value="">Chọn phòng ban</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chức vụ *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  placeholder="Nhân viên bán hàng"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="text-yellow-600 mt-0.5" size={16} />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Thông tin bảo mật</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Mật khẩu mặc định sẽ là <strong>123456</strong>. Người dùng nên thay đổi mật khẩu sau lần đăng nhập đầu tiên.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-[#007744] focus:ring-[#007744]"
                />
                <span className="text-sm font-medium text-gray-700">Kích hoạt tài khoản</span>
              </label>
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
                className="px-6 py-2 bg-[#007744] text-white rounded-lg hover:bg-[#006633] transition-colors flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{user ? 'Cập nhật' : 'Thêm mới'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;