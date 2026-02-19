import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileRepoImpl } from "../../data/repositories/ProfileRepoImpl";
import { UpdateProfileUsecase } from "../../domain/usecase/UpdateProfileUsecase";
import type { Profile } from "../../domain/entities/profile";
import { toast } from "react-toastify";
export function useUpdateProfile() {
  const repo = new ProfileRepoImpl();
  const usecase = new UpdateProfileUsecase(repo);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-profile"],

    mutationFn: (data: FormData) => usecase.execute(data),

    onSuccess: (updatedProfile: Profile) => {
      
      queryClient.setQueryData(["profile"], updatedProfile);
      toast.success("Profile Updated successfully!");
    },
    onError:(Error)=>{
        toast.error(`Error ${Error.message}`)
    }
  });
}
