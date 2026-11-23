import { durationMs, intervalsOverlap, parseInterval } from './intervals.ts'

export interface Room {
  id: string
  name: string
  blocked: boolean
}

export interface Booking {
  roomId: string
  start: string
  end: string
}

export interface BookingRequest {
  roomId: string
  start: string
  end: string
}

export interface AvailabilityResult {
  available: boolean
  reason: string
}

const MAX_DURATION_MS = 120 * 60 * 1000

export function canBook(
  request: BookingRequest,
  room: Room,
  bookings: readonly Booking[],
  now: Date = new Date(),
): AvailabilityResult {
  const requestedInterval = parseInterval(request.start, request.end)

  if (!requestedInterval) {
    return { available: false, reason: 'Choose a valid start and end time.' }
  }

  if (requestedInterval.start < now.getTime()) {
    return { available: false, reason: 'The start time cannot be in the past.' }
  }

  if (durationMs(requestedInterval) > MAX_DURATION_MS) {
    return { available: false, reason: 'Bookings may be at most 120 minutes.' }
  }

  if (room.blocked || request.roomId !== room.id) {
    return { available: false, reason: 'This room is currently blocked.' }
  }

  const overlaps = bookings.some((booking) => {
    if (booking.roomId !== request.roomId) return false
    const bookedInterval = parseInterval(booking.start, booking.end)
    return bookedInterval ? intervalsOverlap(requestedInterval, bookedInterval) : false
  })

  if (overlaps) {
    return { available: false, reason: 'That time overlaps an existing booking.' }
  }

  return { available: true, reason: 'The room is available.' }
}

