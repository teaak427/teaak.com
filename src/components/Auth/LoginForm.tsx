import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Lock, AlertCircle, Loader2, Zap } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [citizenId, setCitizenId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!citizenId || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (citizenId.length !== 12) {
      setError('Số căn cước công dân phải có 12 chữ số');
      return;
    }

    const success = await login(citizenId, password);
    if (!success) {
      setError('Thông tin đăng nhập không chính xác');
    }
  };

  const handleQuickDemo = async () => {
    setError('');
    // Tự động đăng nhập với tài khoản admin demo
    const success = await login('079123456789', '123456');
    if (!success) {
      setError('Không thể truy cập demo');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#007744] to-[#005533] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#007744] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              F
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Fremed</h2>
            <p className="text-gray-600 mt-2">Hệ thống nội bộ công ty</p>
          </div>

          {/* Quick Demo Access */}
          <div className="mb-6">
            <button
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang truy cập...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>🚀 Vào thẳng Demo (Admin)</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Truy cập nhanh với quyền quản trị viên
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Hoặc đăng nhập thủ công</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="citizenId" className="block text-sm font-medium text-gray-700 mb-2">
                Số căn cước công dân
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="citizenId"
                  type="text"
                  value={citizenId}
                  onChange={(e) => setCitizenId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="Nhập 12 chữ số"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007744] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#007744] text-white py-3 px-4 rounded-lg hover:bg-[#006633] focus:ring-2 focus:ring-[#007744] focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Tài khoản demo:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Admin:</strong> 079123456789 / 123456</p>
              <p><strong>Manager:</strong> 079987654321 / 123456</p>
              <p><strong>Employee:</strong> 079555666777 / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;