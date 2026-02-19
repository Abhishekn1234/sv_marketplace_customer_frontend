import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

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
      toast.success(response.message || 'Login successful');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex-1 flex flex-col items-center justify-center px-6 py-16 bg-[#F8FAFC] p-4">
     
      <Badge className="mb-8  flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#E2E8F0] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A1D37]/60 font-['Inter','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','sans-serif']">
          Premium Home Services
        </span>

        </Badge>

    
     <div className="
  w-full 
  max-w-[280px]      /* default for small screens */
  sm:max-w-[360px]   /* small devices */
  md:max-w-[480px]   /* medium devices */
  lg:max-w-[480px]   /* large devices */
  xl:max-w-[480px]   /* extra-large devices */
  font-['Plus_Jakarta_Sans']
"
>
  <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-[#E2E8F0] relative overflow-hidden shadow-xl">

  
    <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563eb]" />

   
    <div className="mb-10 text-center">
      <h1 className="text-[#0A1D37] text-4xl font-extrabold tracking-tight mb-3">
        Welcome Back
      </h1>
       </div>
      <p className="text-[#1a1a2e] font-weight-500 w-[15px]">
        Enter your credentials to access your dashboard
      </p>
   

        <form onSubmit={handleSubmit} className="space-y-6">

      
      <div>
        <Label
          htmlFor="email"
          className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3"
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@homeease.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full px-5 py-4
            rounded-xl
            border-2 border-[#E2E8F0]
            bg-[#F8FAFC]
            text-[#0A1D37]
            font-medium
            placeholder:text-slate-300
            focus:ring-2 focus:ring-[#0D9488]/20
            focus:border-[#0D9488]
            transition-all
          "
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label
            htmlFor="password"
            className="block text-xs font-bold text-slate-400 uppercase tracking-wider"
          >
            Password
          </Label>
          <span className="text-xs font-bold text-[#0D9488] hover:text-[#0A1D37] cursor-pointer transition-colors">
            Forgot password?
          </span>
        </div>

        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full px-5 py-4
              rounded-xl
              border-2 border-[#E2E8F0]
              bg-[#F8FAFC]
              text-[#0A1D37]
              font-medium
              placeholder:text-slate-300
              focus:ring-2 focus:ring-[#0D9488]/20
              focus:border-[#0D9488]
              transition-all
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#0D9488] transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

    
      <div className="flex items-center gap-3">
        <Input
          id="remember"
          type="checkbox"
          className="
            w-5 h-5
            rounded
            border-2 border-[#E2E8F0]
            text-[#0D9488]
            focus:ring-[#0D9488]
            cursor-pointer
          "
        />
        <Label
          htmlFor="remember"
          className="text-sm text-slate-600 font-medium cursor-pointer select-none"
        >
          Keep me logged in
        </Label>
      </div>

      {/* Submit */}
      <Button
  type="submit"
  disabled={loading}
  className="
    w-full
    h-[52px]
    bg-blue-600
    text-white
    text-[15px] font-semibold
    rounded-[26px]
    flex items-center justify-center gap-2
    shadow-[0_4px_16px_rgba(37,99,235,0.3)]
    mb-6
    transition-all duration-200 ease-in-out
    hover:bg-blue-700
    hover:-translate-y-0.5
    hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)]
    cursor-pointer
    group
  "
>
  Continue
  <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
</Button>

    </form>


    <div className="relative my-10">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#E2E8F0]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
          Secure Access
        </span>
      </div>
    </div>

    
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
  <Button
    variant="ghost"
    className="
      h-12
      flex items-center justify-center gap-2
      bg-white
      border-2 border-gray-200
      rounded-xl
      text-sm font-semibold text-gray-700
      transition-all duration-200
      hover:border-blue-600
      hover:bg-gray-50
      cursor-pointer
    "
  >
     <svg  className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
    <span>Google</span>
  </Button>

  <Button
    variant="ghost"
    className="
      h-12
      flex items-center justify-center gap-2
      bg-white
      border-2 border-gray-200
      rounded-xl
      text-sm font-semibold text-gray-700
      transition-all duration-200
      hover:border-blue-600
      hover:bg-gray-50
      cursor-pointer
    "
  >
    <svg  className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
                        <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
    <span>Facebook</span>
  </Button>
</div>


    <div className="flex justify-center mt-6">
        <p className="text-gray-700 text-sm font-semibold">
          New to our premium network?
          <Link
            to="/register"
            className="text-[#f59e0b] font-bold ml-1 hover:underline transition-colors"
          >
            Join as a Partner
          </Link>
        </p>
      </div>
  </div>
  
</div>

    
      
    </div>
  );
}
