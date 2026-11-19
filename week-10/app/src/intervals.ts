export interface TimeInterval {
  start: number
  end: number
}

export function parseInterval(startValue: string, endValue: string): TimeInterval | null {
  const start = new Date(startValue).getTime()
  const end = new Date(endValue).getTime()

  return Number.isFinite(start) && Number.isFinite(end) && start < end ? { start, end } : null
}

export function durationMs(interval: TimeInterval): number {
  return interval.end - interval.start
}

export function intervalsOverlap(left: TimeInterval, right: TimeInterval): boolean {
  return left.start < right.end && left.end > right.start
}
