import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { useLanguage } from "@/features/context/LanguageContext";

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

  try {
    const payload = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    const response = await register(payload);
    toast.success(response.message || "Registration successful");
    navigate('/verification');
  } catch (err: any) {
    toast.error(
      err?.message?.[0] || err.message || "Registration failed"
    );
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
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              placeholder={t.register.phonePlaceholder}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2">
             {t.register.password}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition"
              placeholder={t.register.passwordPlaceholder}
            />
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
            className="w-full h-14 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition hover:bg-blue-800 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)]"
          >
           {t.register.submit}
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
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
