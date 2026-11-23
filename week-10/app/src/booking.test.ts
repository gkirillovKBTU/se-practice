import { expect, test } from 'vitest'
import { canBook, type Booking, type BookingRequest, type Room } from './booking.ts'

const room: Room = { id: 'north-204', name: 'North Hall 204', blocked: false }
const now = new Date('2030-04-01T08:00:00.000Z')
const bookings: Booking[] = [
  {
    roomId: room.id,
    start: '2030-05-10T10:00:00.000Z',
    end: '2030-05-10T11:00:00.000Z',
  },
]

const request = (start: string, end: string): BookingRequest => ({ roomId: room.id, start, end })

test('AC1 rejects a start in the past', () => {
  expect(canBook(request('2030-03-31T10:00:00.000Z', '2030-03-31T11:00:00.000Z'), room, bookings, now).available).toBe(false)
})

test('AC1 rejects an equal or reversed interval', () => {
  expect(canBook(request('2030-05-10T09:00:00.000Z', '2030-05-10T09:00:00.000Z'), room, bookings, now).available).toBe(false)
  expect(canBook(request('2030-05-10T09:30:00.000Z', '2030-05-10T09:00:00.000Z'), room, bookings, now).available).toBe(false)
})

test('AC2 rejects a 121-minute request', () => {
  expect(canBook(request('2030-05-10T12:00:00.000Z', '2030-05-10T14:01:00.000Z'), room, bookings, now).available).toBe(false)
})

test('AC3 rejects a blocked room', () => {
  expect(canBook(request('2030-05-10T12:00:00.000Z', '2030-05-10T13:00:00.000Z'), { ...room, blocked: true }, bookings, now).available).toBe(false)
})

test('AC4 rejects a genuine overlap', () => {
  expect(canBook(request('2030-05-10T10:30:00.000Z', '2030-05-10T11:30:00.000Z'), room, bookings, now).available).toBe(false)
})

test('R1 AC4 allows a request that ends when a booking starts', () => {
  expect(canBook(request('2030-05-10T09:00:00.000Z', '2030-05-10T10:00:00.000Z'), room, bookings, now).available).toBe(true)
})

test('AC4 allows a request that starts when a booking ends', () => {
  expect(canBook(request('2030-05-10T11:00:00.000Z', '2030-05-10T12:00:00.000Z'), room, bookings, now).available).toBe(true)
})

test('AC5 does not mutate booking fixtures', () => {
  const before = JSON.stringify(bookings)
  canBook(request('2030-05-10T12:00:00.000Z', '2030-05-10T13:00:00.000Z'), room, bookings, now)
  expect(JSON.stringify(bookings)).toBe(before)
})

test('returns available for a free interval', () => {
  expect(canBook(request('2030-05-10T12:00:00.000Z', '2030-05-10T13:00:00.000Z'), room, bookings, now)).toEqual({ available: true, reason: 'The room is available.' })
})
