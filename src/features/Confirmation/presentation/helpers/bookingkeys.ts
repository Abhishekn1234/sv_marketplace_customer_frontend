export const bookingKeys = {
  all: ["bookings"] as const,
  detail: (id: string) => ["booking", id] as const,
};