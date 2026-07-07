export const formatCoordinates = (
  coordinates: number[] | undefined,
  noDataText: string
) => {
  const lat = coordinates?.[1];
  const lng = coordinates?.[0];

  if (lat == null || lng == null) {
    return noDataText;
  }

  return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
};

