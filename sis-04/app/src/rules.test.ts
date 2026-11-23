import { describe, expect, test } from 'vitest';
import { canBook, checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const rooms: Room[] = [
  { id: 'small', name: 'Small', capacity: 7, equipment: ['whiteboard'], blocked: false, bookings: [] },
  { id: 'exact', name: 'Exact', capacity: 8, equipment: ['projector', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'open', name: 'Open', capacity: 20, equipment: ['projector', 'whiteboard', 'video'], blocked: false, bookings: [] },
  { id: 'blocked', name: 'Blocked', capacity: 30, equipment: ['projector'], blocked: true, bookings: [] },
];

const base = { start: 720, end: 780, now: 540, blocked: false, bookings: [] };

describe('booking rules', () => {
  test('T01 AC1: rejects start equal to end', () => {
    expect(canBook({ ...base, start: 720, end: 720 })).toBe(false);
  });

  test('T02 AC1: rejects a request whose start is in the past', () => {
    expect(canBook({ ...base, start: 500, end: 560 })).toBe(false);
  });

  test('T03 B1 AC2: exactly 120 minutes is available', () => {
    expect(canBook({ ...base, start: 720, end: 840 })).toBe(true);
  });

  test('T04 B2 AC2: 121 minutes is rejected', () => {
    expect(canBook({ ...base, start: 720, end: 841 })).toBe(false);
  });

  test('T05 F3 AC3: a blocked room is unavailable', () => {
    expect(checkRoom(rooms, 'blocked', { start: 720, end: 780, now: 540 })).toBe(false);
  });

  test('T06 B3 AC4: touching an existing booking is available', () => {
    expect(canBook({ ...base, start: 660, end: 720, bookings: [{ start: 600, end: 660 }] })).toBe(true);
  });

  test('T07 B4 AC4: overlapping an existing booking is rejected', () => {
    expect(canBook({ ...base, start: 650, end: 700, bookings: [{ start: 600, end: 660 }] })).toBe(false);
  });

  test('T08 AC5: checking availability does not mutate bookings', () => {
    const bookings = [{ start: 600, end: 660 }];
    const snapshot = JSON.stringify(bookings);
    canBook({ ...base, bookings });
    expect(JSON.stringify(bookings)).toBe(snapshot);
  });

  test('T09 F5: room switching uses each chosen room bookings', () => {
    const request = { start: 600, end: 660, now: 540 };
    expect(checkRoom(rooms, 'exact', request)).toBe(false);
    expect(checkRoom(rooms, 'open', request)).toBe(true);
  });

  test('T10 F5: an unknown room id is unavailable', () => {
    expect(checkRoom(rooms, 'missing', { start: 720, end: 780, now: 540 })).toBe(false);
  });
});

describe('room filtering', () => {
  test('T11 B5 F1: capacity exactly equal to attendees is included', () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: [] }).map(room => room.id)).toContain('exact');
  });

  test('T12 B6 F1: capacity one below attendees is excluded', () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: [] }).map(room => room.id)).not.toContain('small');
  });

  test('T13 F2: a room must contain all required equipment', () => {
    expect(filterRooms(rooms, { attendees: 1, equipment: ['projector', 'video'] }).map(room => room.id)).toEqual(['open']);
  });

  test('T14 F2: equipment order does not affect matching', () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: ['whiteboard', 'projector'] }).map(room => room.id)).toEqual(['exact', 'open']);
  });

  test('T15 F4: impossible criteria returns an empty list', () => {
    expect(filterRooms(rooms, { attendees: 31, equipment: ['projector'] })).toEqual([]);
  });

  test('T16 INT: filtered room can be checked with its own schedule', () => {
    const matches = filterRooms(rooms, { attendees: 10, equipment: ['video'] });
    expect(matches.map(room => room.id)).toEqual(['open']);
    expect(checkRoom(matches, matches[0].id, { start: 720, end: 780, now: 540 })).toBe(true);
  });
});
