export const OPEN_MINUTES = 13 * 60;
export const CLOSE_MINUTES = 17 * 60;
export const LAST_END_MINUTES = 16 * 60 + 50;

export function minutesToTime(minutes: number): string {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function getAvailableTimes(duration: number): string[] {
  const result: string[] = [];

  for (
    let start = OPEN_MINUTES;
    start + duration <= LAST_END_MINUTES;
    start += 10
  ) {
    result.push(minutesToTime(start));
  }

  return result;
}