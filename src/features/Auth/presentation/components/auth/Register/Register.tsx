'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '../../../hooks/useAuth';

interface RegisterProps {
  nextStep?: () => void;
}

export default function Register({ nextStep }: RegisterProps) {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error('Please fill all fields');
      return;
    }

    if (!formData.terms) {
      toast.error('You must accept terms and conditions');
      return;
    }

    const payload = {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    try {
      await register(payload);
      toast.success('Registered successfully!');
      nextStep?.();
    } catch (error) {
      console.error(error);
      toast.error('Registration failed, try again!');
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 font-['Plus_Jakarta_Sans'] bg-[#F8FAFC]">
      <div className="max-w-xl w-full">
        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] border border-[#E2E8F0] shadow-xl relative overflow-hidden">

          <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />

        
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-[#0A1D37]">
              Create Account
            </h1>
            <p className="text-slate-500 mt-2">
              Join HomeEase for expert help at your doorstep.
            </p>
          </div>

         
          <form className="space-y-6" onSubmit={handleSubmit}>

         
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="h-[52px] rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC]"
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="h-[52px] rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC]"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="h-[52px] pl-12 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC]"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="h-[52px] pl-12 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC]"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="h-[52px] pl-12 pr-12 rounded-xl border-2 border-[#E2E8F0] bg-[#F8FAFC]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-start gap-3">
              <Input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-5 w-5 mt-1 accent-[#0D9488]"
              />
              <Label className="text-sm text-slate-500">
                I agree to the{' '}
                <span className="text-[#0D9488] font-bold">Terms</span> and{' '}
                <span className="text-[#0D9488] font-bold">Privacy Policy</span>
              </Label>
            </div>

          
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white text-lg font-bold rounded-full hover:bg-slate-800 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group mt-8"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight />}
            </Button>
          </form>

        
          <div className="mt-10 pt-8 border-t border-cool-gray text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
              <span
                onClick={() => navigate('/login')}
                className="text-[#0D9488] font-bold ml-1 cursor-pointer"
              >
                Log in
              </span>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
