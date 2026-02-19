import type { Location } from "../entities/location";
import type { Profile } from "../entities/profile";

export interface ProfileRepo {
  getProfile(): Promise<Profile>;
  updateProfile(data: FormData): Promise<Profile>;
   updateLocation(id: string, data: Partial<Location>): Promise<Location>;
}