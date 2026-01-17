import { useQuery } from "@tanstack/react-query";

type LocationResponse = {
  display_name?: string;
};

const fetchLocationName = async (coordinates: [number, number]): Promise<string> => {
  const [lng, lat] = coordinates;
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
  );

  if (!res.ok) throw new Error("Failed to fetch location");

  const data: LocationResponse = await res.json();
  return data.display_name ?? "Unknown location";
};

export const useLocationName = (coordinates?: [number, number]) => {
  const enabled = !!coordinates;

  // Only run query if coordinates exist
  const query = useQuery({
    queryKey: coordinates ? ["locationName", coordinates] : ["locationName"],
    queryFn: () => fetchLocationName(coordinates!), // non-null assertion, safe because enabled
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
