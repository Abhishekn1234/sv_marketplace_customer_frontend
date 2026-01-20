import { useQuery } from "@tanstack/react-query";
import { reverseGeocode } from "../../../utils/reverse";

const fetchLocationName = async (
  coordinates: [number, number]
): Promise<string> => {
  const [lng, lat] = coordinates;

  const placeName = await reverseGeocode(lat, lng);

  if (!placeName) {
    throw new Error("Failed to fetch location");
  }

  return placeName;
};

export const useLocationName = (coordinates?: [number, number]) => {
  const enabled = !!coordinates;

  const query = useQuery({
    queryKey: coordinates ? ["locationName", coordinates] : ["locationName"],
    queryFn: () => fetchLocationName(coordinates!),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    locationName: query.data ?? "Unknown location",
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
};
