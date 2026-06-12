import { useAuthStore } from "@/features/core/store/auth";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useState, useEffect } from "react";
import { Input } from "@/components/input";
import { SaveIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";
import Button from "@/components/input/Button";
import CommonCard from "@/components/common/CommonCards";

export default function ProfileUpdate() {
  const { data: profile } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { user, setUser } = useAuthStore();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    if (profile) {
      const fullName = profile.fullName || "";
      const nameParts = fullName.trim().split(" ");

      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  /* ---------------- VALUE BASED HANDLER ---------------- */
  const handleFieldChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();

    form.append(
      "fullName",
      `${formData.firstName} ${formData.lastName}`.trim()
    );

    form.append("email", formData.email);
    form.append("phone", formData.phone);

    updateProfile(form, {
      onSuccess: (updatedUser) => {
        if (!user) return;

        setUser({
          ...user,
          fullName: updatedUser.fullName ?? "",
        });
      },
    });
  };

  return (
    <div className="w-full px-4 py-8 flex justify-center">
      <div className="w-full max-w-2xl">
        <CommonCard>
          {/* TITLE */}
          <h3 className="text-[18px] font-bold text-gray-900 mb-6">
            {t.profilepage.personalInfo}
          </h3>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* FIRST + LAST NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Input
                label={t.profilepage.firstName}
                type="text"
                value={formData.firstName}
                onChange={handleFieldChange("firstName")}
              />

              <Input
                label={t.profilepage.lastName}
                type="text"
                value={formData.lastName}
                onChange={handleFieldChange("lastName")}
              />

            </div>

            {/* EMAIL */}
            <Input
              label={t.profilepage.email}
              type="email"
              value={formData.email}
              onChange={handleFieldChange("email")}
            />

            {/* PHONE */}
            <Input
              label={t.profilepage.phone}
              type="tel"
              value={formData.phone}
              onChange={handleFieldChange("phone")}
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isPending}
              rightIcon={<SaveIcon className="w-5 h-5" />}
              className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? t.profilepage.saving : t.profilepage.saveChanges}
            </Button>

          </form>
        </CommonCard>
      </div>
    </div>
  );
}