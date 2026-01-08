import { useState, useEffect } from 'react';

export const useLocationName = (coordinates?: [number, number]) => {
  const [locationName, setLocationName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coordinates) return;

    const fetchLocationName = async () => {
      setLoading(true);
      try {
        const [lng, lat] = coordinates;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        setLocationName(data.display_name || "Unknown location");
      } catch (err) {
        setLocationName("Unknown location");
      } finally {
        setLoading(false);
      }
    };

    fetchLocationName();
  }, [coordinates]);

  return { locationName, loading };
};