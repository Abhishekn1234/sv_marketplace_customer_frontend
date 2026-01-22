import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));

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

  const fields: (keyof typeof form)[] = [
    "currentPassword",
    "newPassword",
    "confirmPassword",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {fields.map((field) => (
        <div key={field} className="relative">
          <Label className="mb-1 capitalize" htmlFor={field}>
            {field.replace(/([A-Z])/g, " $1")}
          </Label>
          <Input
            id={field}
            type={show[field] ? "text" : "password"}
            value={form[field]}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, [field]: e.target.value }))
            }
            className="pr-10"
          />
          <Button
          variant="ghost"
            type="button"
            onClick={() => toggle(field)}
            className="absolute right-5 translate-x-1/2"
          >
            {show[field] ? <Eye size={18} /> : <EyeOff size={18} />}
          </Button>
        </div>
      ))}

      <Button type="submit" disabled={passwordUpdating} className="w-full">
        {passwordUpdating ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
