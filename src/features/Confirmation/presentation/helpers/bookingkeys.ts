export const bookingKeys = {
  all: ["bookings"] as const,
  detail: (id: string) => ["bookings", id] as const,
};