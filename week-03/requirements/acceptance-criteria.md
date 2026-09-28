# Acceptance criteria — three selected stories

## Assumptions

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because the time intervals do not share any time.
- **Duration:** a booking of exactly two hours is allowed under R2, because two hours is the stated maximum.
- A Student may request a booking only for one room and one continuous time slot at a time.

## US-01 — View availability

### AC-01
- **Given** rooms have bookings and blocked statuses for a selected future time slot
- **When** a Student views availability for that time slot
- **Then** the system shows which rooms are free and which rooms are unavailable.

### AC-02
- **Given** a room has a booking that ends at 14:00
- **When** a Student views availability for a slot beginning at 14:00
- **Then** the room is shown as free for that slot.

### AC-03
- **Given** a room is blocked for a selected time slot
- **When** a Student views availability for that time slot
- **Then** the room is shown as unavailable.

## US-02 — Book room

### AC-04
- **Given** a free, unblocked room and a future time slot lasting exactly two hours
- **When** a Student books the room
- **Then** the system creates the booking and sends a confirmation.

### AC-05
- **Given** a free, unblocked room
- **When** a Student requests a booking that starts in the past
- **Then** the system rejects the booking.

### AC-06
- **Given** a free, unblocked room
- **When** a Student requests a booking longer than two hours
- **Then** the system rejects the booking.

### AC-07
- **Given** a room has an existing booking from 14:00 to 15:00
- **When** a Student requests that room from 14:30 to 15:30
- **Then** the system rejects the overlapping booking.

### AC-08
- **Given** a room is blocked for the requested future time slot
- **When** a Student attempts to book the room
- **Then** the system rejects the booking.

## US-04 — Block or unblock room

### AC-09
- **Given** an unblocked room
- **When** an Administrator blocks the room
- **Then** the system marks the room as blocked and it cannot be booked.

### AC-10
- **Given** a blocked room with no booking for a selected future time slot
- **When** an Administrator unblocks the room
- **Then** the room becomes available for booking in that time slot.

### AC-11
- **Given** a blocked room
- **When** an Administrator blocks the room again
- **Then** the system leaves the room blocked without creating a second status change.
