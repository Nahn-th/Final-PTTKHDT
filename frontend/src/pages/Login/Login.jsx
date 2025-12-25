import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  
  // State quản lý form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- MOCK LOGIN LOGIC (Giả lập Backend) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Giả lập độ trễ mạng
    await new Promise(r => setTimeout(r, 1000));

    // LOGIC PHÂN QUYỀN GIẢ LẬP
    // Sau này Backend sẽ trả về role, ở đây ta check cứng
    try {
      if (username === 'gv' && password === '123') {
        // 1. Giảng viên
        alert("Đăng nhập thành công: Quyền Giảng Viên");
        navigate('/instructor'); 
      } 
      else if (username === 'cb' && password === '123') {
        // 2. Cán bộ phụ trách (Lab Assistant)
        alert("Đăng nhập thành công: Quyền Cán Bộ");
        navigate('/lab-assistant');
      } 
      else if (username === 'sv' && password === '123') {
        // 3. Sinh viên
        alert("Đăng nhập thành công: Quyền Sinh Viên");
        navigate('/student/schedule'); // Hoặc trang đăng ký
      } 
      else if (username === 'admin' && password === '123') {
        navigate('/academic-affairs');
      }
      else {
        throw new Error('Tên đăng nhập hoặc mật khẩu không đúng!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-4xl overflow-hidden">
        
        {/* Cột trái: Hình ảnh/Brand */}
        <div className="hidden md:flex w-1/2 bg-blue-600 flex-col items-center justify-center p-12 text-white relative">
          <div className="absolute inset-0 bg-blue-700 opacity-20 pattern-grid-lg"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <ShieldCheck size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">9D IT Lab Management</h2>
            <p className="text-blue-100">
              Hệ thống quản lý thực hành, phân lịch và điểm danh thông minh dành cho Khoa CNTT.
            </p>
          </div>
        </div>

        {/* Cột phải: Form đăng nhập */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-800">Đăng nhập</h3>
            <p className="text-gray-500 text-sm mt-2">Vui lòng đăng nhập để truy cập hệ thống</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập / MSSV</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="Nhập mã số..."
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in">
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
              </label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Đăng nhập <LogIn size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Footer Helper */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            <p>Hệ thống Quản lý Thực hành - Khoa CNTT</p>
            <p className="mt-1">Liên hệ hỗ trợ: 9Dsupport@hcmue.edu.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
