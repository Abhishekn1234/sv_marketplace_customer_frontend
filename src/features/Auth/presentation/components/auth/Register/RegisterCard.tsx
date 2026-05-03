import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import { Input, Checkbox, PhoneInput as CustomPhoneInput } from "@/components/input";
import Button from "@/components/input/Button";

const RegistrationCard = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    agreeToTerms: false,
  });
  const {t}=useLanguage();
  const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
 const { setMobileForVerification,setTokens,setUser } = useAuthStore();
  const { register } = useAuth();
  const navigate=useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
   setLoading(true);

  try {
    const payload = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    const response = await register(payload);

    // Save full response in auth store
    setTokens(response.accessToken, response.refreshToken); // access & refresh
    setUser(response.user); // user object
    setMobileForVerification(formData.phone); // for OTP verification

    // toast.success(response.message || "Registration successful");
    navigate("/verification");
    setLoading(false); // navigate to OTP verification
  } catch (err: any) {
    toast.error(err?.message?.[0] || err.message || "Registration failed");
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 font-inter px-4">
      <div className="relative w-full max-w-[520px] bg-white border border-gray-200 rounded-[32px] p-12 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500" />

        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full shadow-sm mb-6">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
           {t.register.badge}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            {t.register.title}
          </h1>
          <p className="text-gray-500 font-medium">
            {t.register.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Names */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {["firstName", "lastName"].map((field, i) => (
              <div key={field}>
                <Input
                  label={i === 0 ? t.register.firstName : t.register.lastName}
                  labelClassName="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2"
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  required
                  placeholder={i === 0 ? t.register.firstNamePlaceholder: t.register.lastNamePlaceholder}
                />
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="mb-4">
            <Input
              label={t.register.email}
              labelClassName="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={t.register.emailPlaceholder}
            />
          </div>

          {/* Phone */}
         <div className="mb-4">
          <CustomPhoneInput
            label={t.register.phone}
            labelClassName="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2"
            value={formData.phone}
            onChange={(phone) => setFormData({ ...formData, phone })}
            country="in"
          />
        </div>

          {/* Password */}
             <div className="mb-6">
  <Input
    label={t.register.password}
    labelClassName="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2"
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    required
    minLength={8}
    placeholder={t.register.passwordPlaceholder}
    rightElement={
      <Button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="text-gray-500 hover:text-gray-700"
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </Button>
    }
  />
</div>


    
    

          {/* Terms */}
          <div className="flex gap-3 mb-6">
            <Checkbox
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
              className="mt-1 w-4 h-4 accent-blue-600" // Pass original className to the input
            />
            <p className="text-sm text-gray-500">
              {t.register.termsText}{" "}
              <Link to="/terms" className="text-blue-600 font-bold hover:underline">
                {t.register.terms}
              </Link>{" "}
              {t.register.and}{" "}
              <Link to="/privacy" className="text-blue-600 font-bold hover:underline">
                {t.register.privacy}
              </Link>.
            </p>
          </div>

          {/* Submit */}
          <Button
        type="submit"
        disabled={loading}
        className={`w-full h-14 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 transition 
        ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)]"}`}
      >
        {loading ? (
          <>
            {/* Spinner */}
            <svg
              className="w-5 h-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                d="M22 12a10 10 0 00-10-10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-75"
              />
            </svg>

            Loading...
          </>
        ) : (
          <>
            {t.register.submit}
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
         {t.register.already}{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
           {t.register.login}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationCard;
