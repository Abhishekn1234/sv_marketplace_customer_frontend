import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/features/Auth/presentation/hooks/useAuth';
import { Checkbox, Input, Label } from '@/components/input';
import Button from '@/components/input/Button';
import { ArrowRight, EyeIcon, EyeOffIcon } from '@/components/icons';
import CommonSpinner from '@/components/common/CommonLoadingSpinner';
import { handleApiError } from '@/components/common/ApiError';
import { useLanguage } from '@/features/context/LanguageContext';

const LoginCard = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {t}=useLanguage();
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      toast.success(response.message);
      navigate('/',{replace:true});
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return (
    <div className="relative w-full max-w-md p-12 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 rounded-t-xl"></div>

      {/* Header */}
      <div className="text-center mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {t.loginCard.title}
        </h1>
        <span className="text-sm font-medium text-gray-500">
         {t.loginCard.subtitle}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <Label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
           {t.loginCard.emailLabel}
          </Label>
          <Input
            type="email"
            placeholder={t.loginCard.emailPlaceholder}
            value={email}
            onChange={(value) => setEmail(value)}
            required
            className="w-full px-4 h-13 text-gray-900 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="text-xs font-bold uppercase tracking-wide text-gray-400">
            {t.loginCard.passwordLabel}
          </Label>

          <Link
            to="/forgot-password"
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            {t.loginCard.forgotPassword}
          </Link>
        </div>

  {/* INPUT WRAPPER */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={t.loginCard.passwordPlaceholder}
          value={password}
          onChange={(value) => setPassword(value)}
         rightElement={
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center w-5 h-5 text-gray-500 hover:text-blue-600"
            >
              {showPassword ? <EyeIcon size={5} /> : <EyeOffIcon  size={5}/>}
            </Button>
          }
          required
          className="w-full px-4 h-13 pr-12 text-gray-900 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none"
        />

      
       
      </div>
    </div>

        {/* Remember me */}
        <div className="flex items-center gap-2.5">
                    <Checkbox
            id="remember"
            checked={rememberMe}
            onChange={setRememberMe}
            className="w-4 h-4 cursor-pointer"
          />
          <Label htmlFor="remember" className="text-gray-600 font-medium cursor-pointer">
           {t.loginCard.rememberMe}
          </Label>
        </div>

        {/* Submit Button */}
       <Button
  type="submit"
  disabled={loading}
  rightIcon={
  <>
    <ArrowRight/>
  </>
  }
  className="w-full h-13 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
 >
  <span className="inline-flex items-center gap-2 whitespace-nowrap">
    {loading ? (
      <CommonSpinner size={15} color='white'/>
    ) : (
      <>
        <span>{t.loginCard.continue}</span>

     
      </>
    )}
  </span>
</Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
         {t.loginCard.secureAccess}
        </span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Social login
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
      </div> */}

      {/* Footer link */}
      <p className="text-center text-gray-500 text-sm font-medium">
       {t.loginCard.newToPlatform}{' '}
        <Link
          to="/register"
          className="text-yellow-500 font-bold hover:underline"
        >
         {t.loginCard.joinAsPartner}
        </Link>
      </p>
    </div>
  );
};

export default LoginCard;

