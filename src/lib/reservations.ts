import { addMinutes, parseISO, setHours, setMinutes } from "date-fns";
import { LATE_TOLERANCE_MINUTES } from "./constants";

export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  return setMinutes(setHours(date, hours), minutes);
}

export function reservationExpiresAt(date: Date, startTime: string): Date {
  return addMinutes(combineDateAndTime(date, startTime), LATE_TOLERANCE_MINUTES);
}

export function isSlotOverlapping(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function parseDateOnly(value: string): Date {
  return parseISO(`${value}T12:00:00`);
}
