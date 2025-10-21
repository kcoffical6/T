import { format, parseISO } from "date-fns"

export function formatDate(date: Date | string | number): string {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  return format(dateObj, "MMM d, yyyy")
}

export function formatDateTime(date: Date | string | number): string {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  return format(dateObj, "MMM d, yyyy 'at' h:mm a")
}

export function formatTime(date: Date | string | number): string {
  if (!date) return ""
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  return format(dateObj, "h:mm a")
}

export function formatDateRange(startDate: Date | string | number, endDate: Date | string | number): string {
  if (!startDate || !endDate) return ""
  const start = typeof startDate === "string" ? parseISO(startDate) : new Date(startDate)
  const end = typeof endDate === "string" ? parseISO(endDate) : new Date(endDate)
  
  return `${formatDate(start)} - ${formatDate(end)}`
}

export function isToday(date: Date | string | number): boolean {
  if (!date) return false
  const today = new Date()
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

export function isPast(date: Date | string | number): boolean {
  if (!date) return false
  const now = new Date()
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  
  return dateObj < now
}

export function isFuture(date: Date | string | number): boolean {
  if (!date) return false
  const now = new Date()
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  
  return dateObj > now
}

export function getStartOfDay(date: Date | string | number): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  const start = new Date(dateObj)
  start.setHours(0, 0, 0, 0)
  return start
}

export function getEndOfDay(date: Date | string | number): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date)
  const end = new Date(dateObj)
  end.setHours(23, 59, 59, 999)
  return end
}

export function getDaysBetween(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === "string" ? parseISO(startDate) : new Date(startDate)
  const end = typeof endDate === "string" ? parseISO(endDate) : new Date(endDate)
  
  // Reset both dates to start of day
  const startAtMidnight = new Date(start)
  startAtMidnight.setHours(0, 0, 0, 0)
  
  const endAtMidnight = new Date(end)
  endAtMidnight.setHours(0, 0, 0, 0)
  
  const diffTime = Math.abs(endAtMidnight.getTime() - startAtMidnight.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
