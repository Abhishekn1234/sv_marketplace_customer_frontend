import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await login({ email, password });

    // Save user and tokens in Zustand store (already done inside useAuth)
    // So no need to use localStorage manually

    toast.success(response.message || 'Login successful');
    navigate('/');
  } catch (err: any) {
    toast.error(err.message || 'Login failed');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="email"
                type="email"
                 autoComplete="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Don’t have an account?{' '}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate('/register')}
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
