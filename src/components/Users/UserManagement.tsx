import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import UserForm from './UserForm';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Only admin can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-8 lg:py-12 p-3 lg:p-0">
        <Shield className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-red-400 mb-3 lg:mb-4" />
        <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không có quyền truy cập</h3>
        <p className="text-sm lg:text-base text-gray-600">Bạn không có quyền truy cập vào trang này</p>
      </div>
    );
  }

  const roles = [
    { value: '', label: 'Tất cả vai trò' },
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'manager', label: 'Quản lý' },
    { value: 'employee', label: 'Nhân viên' },
  ];

  const departments = [...new Set(users.map(u => u.department))];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.citizenId.includes(searchTerm);
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesDepartment = !departmentFilter || user.department === departmentFilter;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'manager': return 'Quản lý';
      case 'employee': return 'Nhân viên';
      default: return role;
    }
  };

  const handleToggleStatus = (userId: string, isActive: boolean) => {
    updateUser(userId, { isActive: !isActive });
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteUser(userId);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSaveUser = (userData: any) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
    } else {
      addUser(userData);
    }
    setEditingUser(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-3 lg:space-y-6 p-3 lg:p-0">
      {/* Header - Compact */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full lg:w-auto bg-[#007744] text-white px-4 py-2.5 rounded-xl hover:bg-[#006633] transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
        >
          <Plus size={16} />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Stats - Compact grid */}
      <div className="grid grid-cols-4 gap-2 lg:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <p className="text-xs lg:text-sm font-medium text-gray-600">Tổng</p>
            <p className="text-lg lg:text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <p className="text-xs lg:text-sm font-medium text-gray-600">Hoạt động</p>
            <p className="text-lg lg:text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <p className="text-xs lg:text-sm font-medium text-gray-600">Admin</p>
            <p className="text-lg lg:text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 lg:p-6">
          <div className="text-center">
            <p className="text-xs lg:text-sm font-medium text-gray-600">Phòng ban</p>
            <p className="text-lg lg:text-2xl font-bold text-purple-600">{departments.length}</p>
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
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#007744] focus:border-transparent text-sm"
          >
            <option value="">Tất cả phòng ban</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users List - Mobile Cards */}
      <div className="space-y-2 lg:hidden">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#007744] rounded-full flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.citizenId}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                {getRoleText(user.role)}
              </span>
            </div>
            
            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Phòng ban:</span>
                <span className="font-medium text-gray-900">{user.department}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Chức vụ:</span>
                <span className="text-gray-900">{user.position}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900 truncate ml-2">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => handleToggleStatus(user.id, user.isActive)}
                className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                } transition-colors`}
              >
                {user.isActive ? <UserCheck size={10} /> : <UserX size={10} />}
                <span>{user.isActive ? 'Hoạt động' : 'Tạm khóa'}</span>
              </button>

              <div className="flex space-x-1">
                <button
                  onClick={() => {/* Handle view */}}
                  className="p-2 text-[#007744] hover:bg-[#007744] hover:text-white rounded-lg transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye size={12} />
                </button>
                <button
                  onClick={() => handleEditUser(user)}
                  className="p-2 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit size={12} />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                  title="Xóa"
                  disabled={user.id === user?.id}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#007744] rounded-full flex items-center justify-center text-white font-medium mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.citizenId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{user.department}</p>
                      <p className="text-xs text-gray-500">{user.position}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <Mail size={12} className="mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                      className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {user.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                      <span>{user.isActive ? 'Hoạt động' : 'Tạm khóa'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* Handle view */}}
                        className="text-[#007744] hover:text-[#006633] p-1"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Xóa"
                        disabled={user.id === user?.id}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <Users className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400 mb-3 lg:mb-4" />
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">Không tìm thấy người dùng</h3>
          <p className="text-sm lg:text-base text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* User Form Modal */}
      <UserForm
        isOpen={showForm}
        onClose={handleCloseForm}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;