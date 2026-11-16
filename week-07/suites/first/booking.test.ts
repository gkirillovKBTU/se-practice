import { test, expect } from 'vitest';
import { canBook } from './booking';

test('T01 AC4: touching after', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 660, end: 720, now: 540, blocked: false, bookings })).toBe(true);
});

test('T02 AC1: starts now', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 540, end: 570, now: 540, blocked: false, bookings })).toBe(false);
});

test('T03 AC1: zero duration', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 720, end: 720, now: 540, blocked: false, bookings })).toBe(false);
});

test('T04 AC1: reversed', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 750, end: 720, now: 540, blocked: false, bookings })).toBe(false);
});

test('T05 AC1: past day end', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 1380, end: 1441, now: 540, blocked: false, bookings })).toBe(false);
});

test('T06 AC2: exactly 120 minutes', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 720, end: 840, now: 540, blocked: false, bookings })).toBe(true);
});

test('T07 AC2: 121 minutes', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 720, end: 841, now: 540, blocked: false, bookings })).toBe(false);
});

test('T08 AC4: touching before', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 570, end: 600, now: 540, blocked: false, bookings })).toBe(true);
});

test('T09 AC4: partial overlap', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 630, end: 690, now: 540, blocked: false, bookings })).toBe(false);
});

test('T10 AC4: contains booking', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 570, end: 690, now: 540, blocked: false, bookings })).toBe(false);
});

test('T11 AC4: inside booking', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 615, end: 645, now: 540, blocked: false, bookings })).toBe(false);
});

test('T12 AC4: identical interval', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 600, end: 660, now: 540, blocked: false, bookings })).toBe(false);
});

test('T13 AC3: blocked room', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 660, end: 720, now: 540, blocked: true, bookings })).toBe(false);
});

test('T14 AC4: empty bookings', () => {
  const bookings = [];
  expect(canBook({ start: 630, end: 690, now: 540, blocked: false, bookings })).toBe(true);
});

test('X1 AC1: exact day end', () => {
  const bookings = [{ start: 600, end: 660 }];
  expect(canBook({ start: 1380, end: 1440, now: 540, blocked: false, bookings })).toBe(true);
});

test('X2 AC4: touches two bookings', () => {
  const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
  expect(canBook({ start: 660, end: 720, now: 540, blocked: false, bookings })).toBe(true);
});

test('AC5: available request preserves bookings', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  expect(canBook({ start: 660, end: 720, now: 540, blocked: false, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});
