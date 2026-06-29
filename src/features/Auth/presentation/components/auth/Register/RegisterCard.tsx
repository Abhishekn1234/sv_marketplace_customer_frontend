import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
// import { toast } from "react-toastify";

import { useLanguage } from "@/features/context/LanguageContext";
import { useAuthStore } from "@/features/core/store/auth";
import { Input, Checkbox } from "@/components/input";
import Button from "@/components/input/Button";
import { ArrowRight, EyeIcon, EyeOffIcon } from "@/components/icons";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { handleApiError } from "@/components/common/ApiError";

const RegistrationCard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { register } = useAuth();

  const { setMobileForVerification, setTokens, setUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    agreeToTerms: false,
  });

  /* ---------------- VALUE-BASED HANDLER ---------------- */

  const handleFieldChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  /* ---------------- SUBMIT ---------------- */

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
      console.log(payload);


      const response = await register(payload);

      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);

      setMobileForVerification(formData.phone);

      navigate("/verification");
    } catch (err: any) {
     handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 font-inter px-4">
      <div className="relative w-full max-w-[520px] bg-white border border-gray-200 rounded-[32px] p-12 shadow overflow-hidden">

        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500" />

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t.register.title}
          </h1>
          <p className="text-gray-500">{t.register.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* FIRST + LAST NAME */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label={t.register.firstName}
              value={formData.firstName}
              onChange={handleFieldChange("firstName")}
              placeholder={t.register.firstNamePlaceholder}
            />

            <Input
              label={t.register.lastName}
              value={formData.lastName}
              onChange={handleFieldChange("lastName")}
              placeholder={t.register.lastNamePlaceholder}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <Input
              type="email"
              label={t.register.email}
              value={formData.email}
              onChange={handleFieldChange("email")}
              placeholder={t.register.emailPlaceholder}
            />
          </div>

          {/* PHONE */}
   <div className="mb-4">
  <Input
    type="tel"
    label={t.register.phone}
    value={formData.phone}
    onChange={(value: string) => {
      setFormData((prev) => ({
        ...prev,
        phone: value, // already E.164 formatted from PhoneInput
      }));
    }}
    placeholder={t.register.phonePlaceholder}
  />
</div>

          {/* PASSWORD */}
          <div className="mb-6">
            <Input
              label={t.register.password}
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleFieldChange("password")}
              placeholder={t.register.passwordPlaceholder}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-gray-500"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              }
            />
          </div>

          {/* TERMS */}
          <div className="flex gap-3 mb-6">
            <Checkbox
              checked={formData.agreeToTerms}
              onChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  agreeToTerms: checked,
                }))
              }
            />

            <p className="text-sm text-gray-500">
              {t.register.termsText}{" "}
              <Link to="/terms" className="text-blue-600 font-bold">
                {t.register.terms}
              </Link>{" "}
              {t.register.and}{" "}
              <Link to="/privacy" className="text-blue-600 font-bold">
                {t.register.privacy}
              </Link>
            </p>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            disabled={loading}
            rightIcon={<ArrowRight />}
            className="w-full h-14 rounded-full bg-blue-600 text-white font-semibold"
          >
            {loading ? (
              <CommonSpinner size={20} color="white" />
            ) : (
              <span>{t.register.submit}</span>
            )}
          </Button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
          {t.register.already}{" "}
          <Link to="/login" className="text-blue-600 font-bold">
            {t.register.login}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationCard;
