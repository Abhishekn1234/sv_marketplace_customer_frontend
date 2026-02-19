import apiClient from "@/features/api/interceptor";
import type { Profile } from "../../domain/entities/profile";
import type { ProfileRepo } from "../../domain/repositories/ProfileRepo";
import type { Location } from "../../domain/entities/location";

export class ProfileRepoImpl implements ProfileRepo {
  async getProfile(): Promise<Profile> {
    try {
      const response = await apiClient.get<Profile>("/user/me");

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }
async updateProfile(data: FormData): Promise<Profile> {
  const response = await apiClient.put<Profile>(
    "/user/update-profile",
    data
  );
  return response.data;
}
async updateLocation(id: string, data: Partial<Location>): Promise<Location> {
    const response = await apiClient.patch<Location>(
      `/locations/${id}`,
      data
    );

    return response.data;
  }

}
