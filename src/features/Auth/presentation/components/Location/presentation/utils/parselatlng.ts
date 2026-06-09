export const parseLatLng = (value: string) => {
  const match = value.match(/Lat:\s*([0-9.]+),\s*Lng:\s*([0-9.]+)/);

  if (!match) return null;

  return {
    lat: parseFloat(match[1]),
    lng: parseFloat(match[2]),
  };
};