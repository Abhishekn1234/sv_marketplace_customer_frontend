import { useEffect, useState } from "react";
import {  Lock,  Upload, User } from "lucide-react";
import { useProfile } from "../presentation/hooks/useProfile";
import type { TabType } from "../domain/entities/tabtype";
import type { FormState } from "../domain/entities/formstate.types";
import UpdatePasswordTab from "./components/UpdatePassword";
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

  if (!profile)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );


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
