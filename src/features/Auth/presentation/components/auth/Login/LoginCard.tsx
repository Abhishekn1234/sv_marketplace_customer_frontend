import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/features/Auth/presentation/hooks/useAuth';

const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      toast.success(response.message || 'Login successful');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="relative w-full max-w-md p-12 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 rounded-t-xl"></div>

      {/* Header */}
      <div className="text-center mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome Back
        </h1>
        <span className="text-sm font-medium text-gray-500">
          Enter your credentials to access your dashboard
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@homeease.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 h-13 text-gray-900 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 h-13 text-gray-900 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 pr-12 outline-none"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <path d="M1 1l22 22"/>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
          <label htmlFor="remember" className="text-gray-600 font-medium cursor-pointer">
            Keep me logged in
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-13 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-transform duration-200"
        >
          Continue
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14"/>
            <path d="M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Secure Access
        </span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Social login */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center gap-2 h-12 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-semibold hover:border-blue-600 hover:bg-gray-50 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button className="flex items-center justify-center gap-2 h-12 bg-white border-2 border-gray-200 rounded-lg text-gray-700 font-semibold hover:border-blue-600 hover:bg-gray-50 transition">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      {/* Footer link */}
      <p className="text-center text-gray-500 text-sm font-medium">
        New to our premium network?{' '}
        <Link
          to="/register"
          className="text-yellow-500 font-bold hover:underline"
        >
          Join as a Partner
        </Link>
      </p>
    </div>
  );
};

export default LoginCard;

