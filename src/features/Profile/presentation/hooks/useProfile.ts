import { useState, useEffect } from 'react';
import { ProfileRepository } from '../../data/repositories/ProfileRepository';
import { GetProfileUseCase } from '../../domain/usecases/profile/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../domain/usecases/profile/UpdateProfileUseCase';
import { UploadDocumentUseCase } from '../../domain/usecases/profile/UploadDocumentUseCase';
import type {
  UserProfile,
  UpdateProfileRequest,
  UploadDocumentRequest,
} from '../../domain/entities/profile.types';
import { UpdatePasswordUseCase } from '../../domain/usecases/profile/UpdatePasswordUseCase';
import { toast } from 'react-toastify';

type UpdateProfileRequestWithFiles = UpdateProfileRequest & {
  profileImage?: File;
  idProof?: File;
  addressProof?: File;
  photoProof?: File;
};
const updateCustomerLocalStorage = (updatedProfile: UserProfile) => {
  const stored = localStorage.getItem("customerData");
  if (!stored) return;

  const parsed = JSON.parse(stored);

  const updatedCustomerData = {
    ...parsed,
    ...updatedProfile, // overwrite only profile fields
  };

  localStorage.setItem(
    "customerData",
    JSON.stringify(updatedCustomerData)
  );
};

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fetchLoading, setFetchLoading] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [documentUploading, setDocumentUploading] = useState(false);

  const profileRepository = new ProfileRepository();
  const getProfileUseCase = new GetProfileUseCase(profileRepository);
  const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
  const uploadDocumentUseCase = new UploadDocumentUseCase(profileRepository);
  const updatePasswordUseCase = new UpdatePasswordUseCase(profileRepository);

  /* ---------------- Fetch Profile ---------------- */
  const fetchProfile = async () => {
    try {
      setFetchLoading(true);
      setError(null);

      const response = await getProfileUseCase.execute();
      setProfile(response);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      throw err;
    } finally {
      setFetchLoading(false);
    }
  };

  /* ---------------- Update Profile (NO refetch) ---------------- */
const updateProfile = async (request: UpdateProfileRequestWithFiles) => {
  try {
    setProfileUpdating(true);
    setError(null);

    const updatedProfile = await updateProfileUseCase.execute(request);

    setProfile(prev => {
      if (!prev) return prev;

      const mergedProfile = {
        ...prev,
        fullName: request.fullName ?? prev.fullName,
        address: request.address ?? prev.address,
        profilePictureUrl: request.profileImage
          ? URL.createObjectURL(request.profileImage)
          : prev.profilePictureUrl,
      };

      // ✅ sync localStorage
      updateCustomerLocalStorage(mergedProfile);

      return mergedProfile;
    });

    toast.success("Profile updated successfully ✅");
    return updatedProfile;

  } catch (err: any) {
    const message = err?.message || "Failed to update profile";
    setError(message);
    toast.error(message);
    throw err;
  } finally {
    setProfileUpdating(false);
  }
};





  /* ---------------- Update Password ---------------- */
 const updatePassword = async (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  try {
    setPasswordUpdating(true);
    setError(null);

    await updatePasswordUseCase.execute(
      oldPassword,
      newPassword,
      confirmPassword
    );

    toast.success("Password updated successfully 🔐");
  } catch (err: any) {
    const message = err?.message || "Failed to update password";
    setError(message);
    toast.error(message);
    throw err;
  } finally {
    setPasswordUpdating(false);
  }
};


  /* ---------------- Upload Document (NO refetch) ---------------- */
  const uploadDocument = async (request: UploadDocumentRequest) => {
    try {
      setDocumentUploading(true);
      setError(null);

      const response = await uploadDocumentUseCase.execute(request);

  setProfile(prev => {
  if (!prev) return prev;

  const docs = prev.documents ?? [];

  const updatedDocs = docs.some(d => d.type === request.documentType)
    ? docs.map(d =>
        d.type === request.documentType
          ? { ...d, url: response.url }
          : d
      )
    : [...docs, { type: request.documentType, url: response.url }];

  return {
    ...prev,
    documents: updatedDocs,
  };
});



      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to upload document');
      throw err;
    } finally {
      setDocumentUploading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    error,

    // loading flags
    fetchLoading,
    profileUpdating,
    passwordUpdating,
    documentUploading,

    fetchProfile,
    updateProfile,
    updatePassword,
    uploadDocument,
  };
};

