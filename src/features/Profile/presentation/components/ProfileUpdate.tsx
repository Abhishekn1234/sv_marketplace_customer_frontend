import { useAuthStore } from "@/features/core/store/auth";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useState, useEffect } from "react";

export default function ProfileUpdate() {
  const { data: profile } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { customerData, setUser } = useAuthStore(); // get setter and address updater

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Split fullName into first + last
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const form = new FormData();

  form.append(
    "fullName",
    `${formData.firstName} ${formData.lastName}`.trim()
  );

  updateProfile(form, {
    onSuccess: (updatedUser) => {
      if (customerData.user) {
       setUser({
  ...customerData.user,
  fullName: updatedUser.fullName ?? "",
});

      }
    },
  });
};



  return (
    <div className="w-full px-4 py-8">
      <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-200">
        <h3 className="text-[18px] font-bold text-gray-900 mb-6">
          Personal Information
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

         <button
  type="submit"
  disabled={isPending}
  className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-5 h-5"
  >
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>

  {isPending ? "Saving..." : "Save Changes"}
</button>

        </form>
      </div>
    </div>
  );
}
