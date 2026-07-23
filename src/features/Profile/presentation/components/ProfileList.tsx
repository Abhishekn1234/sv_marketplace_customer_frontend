
import { useState } from 'react';
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useAuthStore } from "@/features/core/store/auth";

import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useLanguage } from "@/features/context/LanguageContext";
import { UserIcon } from '@/components/icons/UserIcon';
import { FileInput, Image } from '@/components/input';
import Button from '@/components/input/Button';
import CommonSpinner from '@/components/common/CommonLoadingSpinner';

import CommonCard from '@/components/common/CommonCards';
import { PencilIcon, StarIcon } from '@/components/icons';
import { useReviews } from '@/features/Reviews/presentation/hooks/useReviews';

export default function ProfileList() {
  const { data: profile, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { setUser, user } = useAuthStore();
  const { data: bookings } = useBookingHistory();
  const { t } = useLanguage();
  const {total}=useReviews();
  const bookingcount =
    bookings?.pages?.reduce(
      (sum, page) => sum + (page.pagination?.totalItems || 0),
      0
    ) || 0;

  const [preview, setPreview] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <CommonSpinner center />
      </div>
    );
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
    <div className="w-full max-w-md">
      <CommonCard>
        <div className="flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="mb-5">
            <div className="relative inline-block">
              {preview || profile?.profilePictureUrl ? (
                <Image
                  src={preview || profile.profilePictureUrl}
                  alt="Profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-gray-100 bg-gray-100 flex items-center justify-center">
                  <UserIcon />
                </div>
              )}

             <FileInput accept="image/*" onFileChange={handleFileChange}>
              <div
                className="
                  absolute bottom-0 right-0
                  w-10 h-10 rounded-full
                  border-2 border-gray-200
                  shadow-md bg-white
                  flex items-center justify-center
                  cursor-pointer
                "
              >
                <PencilIcon className="w-4 h-4" />
              </div>
            </FileInput>
            </div>
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
            <StarIcon className="w-3.5 h-3.5" />
            {t.profilepage.premiumMember}
          </span>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 w-full">
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
                {total}
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
      </CommonCard>
    </div>
  </div>
);
}