import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatTime(date: Date | string | null | undefined) {
  if (!date) return "—";
  return format(new Date(date), "h:mm a");
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatHours(hours: number) {
  return `${Math.round(hours * 10) / 10} hrs`;
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function initialsOf(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}
