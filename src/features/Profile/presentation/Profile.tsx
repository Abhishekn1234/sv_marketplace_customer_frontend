
import { useEffect, useState } from "react";

import { useProfile } from "../presentation/hooks/useProfile";
import type { FormState } from "../domain/entities/formstate.types";

import CommonTabs from "@/components/common/CommonTabs";

import { useProfileTabs } from "./data/tabsdata";

export default function Profile() {
  const { profile, updateProfile, profileUpdating } = useProfile();
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

        const tabsData = useProfileTabs({
        form,
        setForm,
        profileImage,
        setProfileImage,
        profileImageFile,
        setProfileImageFile,
        handleSubmit,
        profileUpdating,
      });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      <CommonTabs tabs={tabsData} defaultValue="profile" className="" />
    </div>
  );
}

