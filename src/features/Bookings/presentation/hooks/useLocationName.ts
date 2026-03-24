import { useQuery } from "@tanstack/react-query";

/**
 * Formats coordinates as "Lat: xx.xxxxx, Lng: yy.yyyyy"
 */
const fetchLocationName = async (
  coordinates: [number, number]
): Promise<string> => {
  const [lng, lat] = coordinates;
  return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
};

export const useLocationName = (coordinates?: [number, number]) => {
  const enabled = !!coordinates;

  const query = useQuery({
    queryKey: coordinates ? ["locationName", coordinates] : ["locationName"],
    queryFn: () => fetchLocationName(coordinates!),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 0, // no retry needed since no API call
  });

  return {
    locationName: query.data ?? "Unknown location",
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
};