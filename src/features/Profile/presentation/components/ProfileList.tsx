import { Pencil, Star } from 'lucide-react';
import { useState } from 'react';
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useAuthStore } from "@/features/core/store/auth";

import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useLanguage } from "@/features/context/LanguageContext";
import { UserIcon } from '@/components/icons/UserIcon';
import { FileInput, Image } from '@/components/input';
import Button from '@/components/input/Button';

export default function ProfileList() {
  const { data: profile, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { setUser, user } = useAuthStore();
  const {data:bookings}=useBookingHistory();
  const bookingcount = bookings?.pages.map((page)=>page.pagination.totalItems)
  const [preview, setPreview] = useState<string | null>(null);
  const {t}=useLanguage();

  if (isLoading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (isError || !profile) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load profile
      </div>
    );
  }

 const handleFileChange = (file: File) => {
  const imageUrl = URL.createObjectURL(file);
  setPreview(imageUrl);

  const formData = new FormData();
  formData.append("profileImage", file);

  updateProfile(formData, {
    onSuccess: (updatedProfile) => {
      if (!user) return;

      setUser({
        ...user,
        profilePictureUrl: updatedProfile.profilePictureUrl,
      });
    },
  });
};

  return (
    <div className="w-full flex justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
        
        {/* Avatar Section */}
        <div className="relative inline-block mb-5">
        {preview || profile?.profilePictureUrl ? (
            <Image
              src={preview || profile?.profilePictureUrl}
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-gray-100 bg-gray-100 flex items-center justify-center">
              <UserIcon />
            </div>
          )}

          <FileInput
            accept="image/*"
            onFileChange={handleFileChange} // Pass the new handleFileChange
          >
          {/* The button below will trigger the FileInput */}

          {/* Edit Button */}
                      <Button
              disabled={isPending}
              className="
                absolute bottom-0 right-0
                w-10 h-10
                
                text-black
                hover:bg-gray-100
                rounded-full
                flex items-center justify-center
                border-2 border-gray-200
                shadow-md
                transition-all duration-200
                hover:scale-105
                disabled:opacity-60
              "
            >
              <Pencil className="w-4 h-4 text-black" />
            </Button>
          </FileInput>
        </div>

        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {profile.fullName}
        </h2>

        {/* Email */}
        <p className="text-sm text-gray-500 mb-3">
          {profile.email}
        </p>

        {/* Premium Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full text-xs font-bold text-white uppercase tracking-wide">
          <Star className="w-3.5 h-3.5" />
         {t.profilepage.premiumMember}
        </span>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <span className="block text-2xl font-bold text-blue-600">
             {bookingcount}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              
              {t.profilepage.bookings}
            </span>
          </div>

          <div className="text-center">
            <span className="block text-2xl font-bold text-blue-600">
              12
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {t.profilepage.reviews}
            </span>
          </div>

          <div className="text-center">
            <span className="block text-2xl font-bold text-blue-600">
              3
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {t.profilepage.favorites}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}