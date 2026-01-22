
import { User, Lock, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UpdatePasswordTab from "../components/UpdatePassword";
import type { TabType } from "../../domain/entities/tabtype";
import type { FormState } from "../../domain/entities/formstate.types";

interface UseProfileTabsProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  profileImage?: string;
  setProfileImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  profileImageFile?: File;
  setProfileImageFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  profileUpdating?: boolean;
}
export function useProfileTabs({
  form,
  setForm,
  profileImage,
  setProfileImage,
  profileImageFile,
  setProfileImageFile,
  handleSubmit,
  profileUpdating,
}: UseProfileTabsProps) {
  const tabsData: {
    label: React.ReactNode;
    value: TabType;
    content: React.ReactNode;
  }[] = [
    {
      label: (
        <div className="flex items-center gap-2">
          <User size={18} />
          Profile
        </div>
      ),
      value: "profile",
      content: (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex items-center gap-4">
            <img
              src={profileImage}
              className="w-24 h-24 rounded-full object-cover border"
              alt="Profile"
            />
            <label className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                <Upload size={16} /> Upload Photo
              </div>
              <Input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setProfileImageFile(file);

                  // Update the preview URL
                  setProfileImage(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {/* Show selected file name if any */}
          {profileImageFile && (
            <p className="text-sm text-gray-500">
              Selected file: {profileImageFile.name}
            </p>
          )}

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={form.email} disabled />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} disabled />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                rows={3}
                value={form.address}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={profileUpdating}>
            {profileUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      ),
    },
    {
      label: (
        <div className="flex items-center gap-2">
          <Lock size={18} />
          Password
        </div>
      ),
      value: "password",
      content: <UpdatePasswordTab />,
    },
  ];

  return tabsData;
}

