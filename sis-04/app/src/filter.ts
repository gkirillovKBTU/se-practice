import type { Room } from './rooms';

export type RoomCriteria = {
  attendees: number;
  equipment: string[];
};

export function filterRooms(rooms: Room[], criteria: RoomCriteria): Room[] {
  return rooms.filter(
    room =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every(item => room.equipment.includes(item)),
  );
}
