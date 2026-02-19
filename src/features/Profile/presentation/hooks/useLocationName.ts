import { useState, useCallback } from "react";
import type { Location } from "../../domain/entities/location";
import { ProfileRepoImpl } from "../../data/repositories/ProfileRepoImpl";
import { UpdateLocationUsecase } from "../../domain/usecase/UpdateLocationUsecase";
import {toast} from "react-toastify"
const profileRepo = new ProfileRepoImpl();
const updateLocationUsecase = new UpdateLocationUsecase(profileRepo);

export const useUpdateLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = useCallback(
    async (
      id: string,
      data: Partial<Location>
    ): Promise<Location | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await updateLocationUsecase.execute(id, data);
        return result;
      } catch (err: any) {
        setError(err.message || "Failed to update location");
        toast.error(err.message)
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    updateLocation,
    loading,
    error,
  };
};

