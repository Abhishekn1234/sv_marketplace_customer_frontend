import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
                  {i === 0 ? t.register.firstName : t.register.lastName}
                </label>
                <input
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  placeholder={i === 0 ? t.register.firstNamePlaceholder: t.register.lastNamePlaceholder}
                />
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
             {t.register.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              placeholder={t.register.emailPlaceholder}
            />
          </div>

          {/* Phone */}
         <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
            {t.register.phone}
          </label>

          <PhoneInput
            country={"in"} // default country (India)
            value={formData.phone}
            onChange={(phone) =>
              setFormData({ ...formData, phone })
            }
            inputClass="!w-full !h-12 !rounded-xl !border-2 !border-gray-200 !bg-gray-50 focus:!bg-white focus:!border-blue-600"
            containerClass="w-full"
            buttonClass="!border-none"
          />
        </div>

          {/* Password */}
           <div className="mb-6">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
        {t.register.password}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
          placeholder={t.register.passwordPlaceholder}
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>

          {/* Terms */}
          <div className="flex gap-3 mb-6">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              required
              className="mt-1 w-4 h-4 accent-blue-600"
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
          <button
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
      </button>
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
