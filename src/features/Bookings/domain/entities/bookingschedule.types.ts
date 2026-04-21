export interface BookingSchedule {
  startDateTime: string | undefined; 
  estimatedDays: number;
  estimatedHours:number;
  actualWorkDays?: number;
  actualWorkHours?: number;
  ratePerHour?: number;
  ratePerDay?: number;
  actualWorkMinutes?: number;
}