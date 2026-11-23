import type { Booking, Room } from './rooms';

export type BookingRequest = {
  start: number;
  end: number;
  now: number;
};

export type AvailabilityInput = BookingRequest & {
  blocked: boolean;
  bookings: Booking[];
};

export function canBook({ start, end, now, blocked, bookings }: AvailabilityInput): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (start <= now) return false;
  if (end - start > 120) return false;
  if (blocked) return false;

  return !bookings.some(booking => start < booking.end && end > booking.start);
}

export function checkRoom(rooms: Room[], roomId: string, request: BookingRequest): boolean {
  const room = rooms.find(candidate => candidate.id === roomId);
  if (!room) return false;

  return canBook({
    ...request,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}
