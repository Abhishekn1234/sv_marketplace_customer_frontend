import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Upload, User } from "lucide-react";
import { useProfile } from "../presentation/hooks/useProfile";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type TabType = "profile" | "password";

/* ---------------- PASSWORD TAB ---------------- */

function UpdatePasswordTab() {
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

/* ---------------- PROFILE ---------------- */

export default function Profile() {
  const { profile, updateProfile, profileUpdating } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState<string>();
  const [profileImageFile, setProfileImageFile] = useState<File>();

  /* CENTRAL AUTO UPDATE */
  useEffect(() => {
    if (!profile) return;

    setForm({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
    });

    setProfileImage(profile.profilePictureUrl);
    setProfileImageFile(undefined);
  }, [profile]);

  /* cleanup blob */
  useEffect(() => {
    return () => {
      if (profileImage?.startsWith("blob:")) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [profileImage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: form.fullName,
      address: form.address,
      profileImage: profileImageFile,
    });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      <div className="flex border-b mb-15">
  {(["profile", "password"] as TabType[]).map(tab => {
    const isActive = activeTab === tab;

    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${
          isActive
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {tab === "profile" ? (
          <>
            <User size={18} />
            <span>Profile</span>
          </>
        ) : (
          <>
            <Lock size={18} />
            <span>Password</span>
          </>
        )}
      </button>
    );
  })}
</div>

      {activeTab === "profile" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={profileImage}
              className="w-24 h-24 rounded-full object-cover border"
            />
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                <Upload size={16} /> Upload Photo
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setProfileImageFile(file);
                  setProfileImage(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-lg px-3 py-2"
              value={form.fullName}
              onChange={e =>
                setForm(prev => ({ ...prev, fullName: e.target.value }))
              }
            />
            <input className="border rounded-lg px-3 py-2" value={form.email} disabled />
            <input className="border rounded-lg px-3 py-2" value={form.phone} disabled />
            <textarea
              className="border rounded-lg px-3 py-2 md:col-span-2"
              rows={3}
              value={form.address}
              onChange={e =>
                setForm(prev => ({ ...prev, address: e.target.value }))
              }
            />
          </div>

          <button
            disabled={profileUpdating}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            {profileUpdating ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}

      {activeTab === "password" && <UpdatePasswordTab />}
    </div>
  );
}
