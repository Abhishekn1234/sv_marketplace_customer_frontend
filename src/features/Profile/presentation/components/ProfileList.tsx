import { Pencil, Star } from "lucide-react";
import { useRef, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useAuthStore } from "@/features/core/store/auth";

export default function ProfileList() {
  const { data: profile, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { setUser, user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  // Open file picker
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

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

        {/* Avatar */}
        <div className="relative inline-block mb-5">
          <img
            src={preview || profile.profilePictureUrl}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100"
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Edit Button */}
          <button
            onClick={handleEditClick}
            disabled={isPending}
            className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-full flex items-center justify-center border-4 border-white shadow-md hover:scale-105"
          >
            <Pencil className="w-4 h-4 text-white" />
          </button>
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
          Premium Member
        </span>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200"> <div className="text-center"> <span className="block text-2xl font-bold text-blue-600"> 47 </span> <span className="text-xs text-gray-500 uppercase tracking-wide"> Bookings </span> </div> <div className="text-center"> <span className="block text-2xl font-bold text-blue-600"> 12 </span> <span className="text-xs text-gray-500 uppercase tracking-wide"> Reviews </span> </div> <div className="text-center"> <span className="block text-2xl font-bold text-blue-600"> 3 </span> <span className="text-xs text-gray-500 uppercase tracking-wide"> Favorites </span> </div> </div>
      </div>
      
    </div>
  );
}
