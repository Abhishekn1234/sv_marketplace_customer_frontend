import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { ProfileRepository } from "../../data/repositories/ProfileRepository";
import { GetProfileUseCase } from "../../domain/usecases/profile/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../domain/usecases/profile/UpdateProfileUseCase";
import { UploadDocumentUseCase } from "../../domain/usecases/profile/UploadDocumentUseCase";
import { UpdatePasswordUseCase } from "../../domain/usecases/profile/UpdatePasswordUseCase";
import { useAuthStore } from "../../../core/store/auth";
import type {UserProfile} from "../../domain/entities/profile.types";
import type { UploadDocumentRequest } from "../../domain/entities/uploaddocumentrequest.types";
import { mapProfileToUser } from "../../../core/mappers/mapfileprofile";
import type { UpdateProfileRequestWithFiles } from "../../domain/entities/updateprofiletypes";



export const useProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  const repository = useMemo(() => new ProfileRepository(), []);
  const getProfileUC = useMemo(() => new GetProfileUseCase(repository), [repository]);
  const updateProfileUC = useMemo(() => new UpdateProfileUseCase(repository), [repository]);
  const uploadDocumentUC = useMemo(() => new UploadDocumentUseCase(repository), [repository]);
  const updatePasswordUC = useMemo(() => new UpdatePasswordUseCase(repository), [repository]);

  const {
    data: profile,
    error,
    isLoading: fetchLoading,
    refetch: fetchProfile,
  } = useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => getProfileUC.execute(),
  });

  const { mutateAsync: updateProfile, isPending: profileUpdating } = useMutation({
    mutationFn: (req: UpdateProfileRequestWithFiles) =>
      updateProfileUC.execute(req),
    onSuccess: (response) => {
      queryClient.setQueryData<UserProfile>(["profile"], response);
      setUser(mapProfileToUser(response));
      toast.success("Profile updated successfully ✅");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update profile");
    },
  });

  const { mutateAsync: updatePassword, isPending: passwordUpdating } = useMutation({
    mutationFn: (req: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) =>
      updatePasswordUC.execute(
        req.oldPassword,
        req.newPassword,
        req.confirmPassword
      ),
    onSuccess: () => {
      toast.success("Password updated successfully 🔐");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update password");
    },
  });

  const { mutateAsync: uploadDocument, isPending: documentUploading } = useMutation({
    mutationFn: (req: UploadDocumentRequest) =>
      uploadDocumentUC.execute(req),
    onSuccess: (response, req) => {
      queryClient.setQueryData<UserProfile>(["profile"], (prev) => {
        if (!prev) return prev;

        const documents = prev.documents ?? [];
        const updatedDocuments = documents.some((d) => d.type === req.documentType)
          ? documents.map((d) =>
              d.type === req.documentType ? { ...d, url: response.url } : d
            )
          : [...documents, { type: req.documentType, url: response.url }];

        const updatedProfile = { ...prev, documents: updatedDocuments };
        setUser(mapProfileToUser(updatedProfile));
        return updatedProfile;
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to upload document");
    },
  });

  return {
    profile,
    error: error ? (error as Error).message : null,
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

