import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordTab() {
  const { updatePassword, passwordUpdating } = useProfile();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggle = (key: keyof typeof show) =>
    setShow(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (form.newPassword !== form.confirmPassword) return;

  await updatePassword({
    oldPassword: form.currentPassword,
    newPassword: form.newPassword,
    confirmPassword: form.confirmPassword,
  });

  setForm({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4 mx-auto max-w-140 ">
      {(["currentPassword", "newPassword", "confirmPassword"] as const).map(
        field => (
          <div key={field} className="relative">
            <input
              type={show[field] ? "text" : "password"}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={form[field]}
              onChange={e =>
                setForm(prev => ({ ...prev, [field]: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={() => toggle(field)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {show[field] ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        )
      )}

      <button
        disabled={passwordUpdating}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {passwordUpdating ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}