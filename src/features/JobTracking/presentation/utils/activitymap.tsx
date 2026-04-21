import type { Activity } from "../../domain/entities/jobtimelineactivities";

export function getActivityMap(activities?: Activity[]): Record<string, Activity> {
  if (!activities || activities.length === 0) return {};

  return activities.reduce((acc, a) => {
    const existing = acc[a.type];

    acc[a.type] = existing
      ? new Date(a.createdAt) > new Date(existing.createdAt)
        ? a
        : existing
      : a;

    return acc;
  }, {} as Record<string, Activity>);
}