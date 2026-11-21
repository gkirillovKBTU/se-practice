export type Booking = {
  start: number;
  end: number;
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

export const EQUIPMENT = ['projector', 'whiteboard', 'video conferencing'] as const;

export const ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 12,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b204',
    name: 'Room B-204',
    capacity: 24,
    equipment: ['whiteboard', 'video conferencing'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'c303',
    name: 'Lab C-303',
    capacity: 8,
    equipment: ['projector'],
    blocked: true,
    bookings: [{ start: 780, end: 840 }],
  },
  {
    id: 'd410',
    name: 'Auditorium D-410',
    capacity: 40,
    equipment: ['projector', 'whiteboard', 'video conferencing'],
    blocked: false,
    bookings: [{ start: 660, end: 720 }],
  },
];
