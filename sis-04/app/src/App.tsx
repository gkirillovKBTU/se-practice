import { useEffect, useMemo, useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { EQUIPMENT, ROOMS } from './rooms';

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatMinutes = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export default function App() {
  const [attendees, setAttendees] = useState(1);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('11:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const matchingRooms = useMemo(
    () => filterRooms(ROOMS, { attendees, equipment: requiredEquipment }),
    [attendees, requiredEquipment],
  );

  const selectedRoom = matchingRooms.find(room => room.id === roomId);

  useEffect(() => {
    if (!selectedRoom && matchingRooms.length > 0) {
      setRoomId(matchingRooms[0].id);
    }
    setResult(null);
    setError('');
  }, [matchingRooms, selectedRoom]);

  function toggleEquipment(item: string) {
    setRequiredEquipment(current =>
      current.includes(item) ? current.filter(value => value !== item) : [...current, item],
    );
  }

  function checkAvailability() {
    setResult(null);
    if (!selectedRoom || !start || !now || (!end && !endOfDay)) {
      setError('Select a matching room and fill in all times.');
      return;
    }

    const startMinutes = toMinutes(start);
    const endMinutes = endOfDay ? 1440 : toMinutes(end);
    const nowMinutes = toMinutes(now);

    if (!(startMinutes < endMinutes)) {
      setError('The end time must be after the start time.');
      return;
    }

    setError('');
    setResult(
      checkRoom(ROOMS, selectedRoom.id, {
        start: startMinutes,
        end: endMinutes,
        now: nowMinutes,
      }),
    );
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">SMART CAMPUS</p>
        <h1>Find a room that fits.</h1>
        <p className="subtitle">Filter the campus catalog, then check the selected room's schedule.</p>
      </header>

      <section className="panel" aria-labelledby="requirements-heading">
        <div className="section-heading">
          <div><span className="step">01</span><h2 id="requirements-heading">Room requirements</h2></div>
          <span className="match-count">{matchingRooms.length} match{matchingRooms.length === 1 ? '' : 'es'}</span>
        </div>

        <div className="requirements-grid">
          <label>
            Attendees
            <input
              type="number"
              min="1"
              max="200"
              value={attendees}
              onChange={event => setAttendees(Math.max(1, Number(event.target.value) || 1))}
            />
          </label>
          <fieldset>
            <legend>Required equipment</legend>
            <div className="equipment-options">
              {EQUIPMENT.map(item => (
                <label className="check-option" key={item}>
                  <input
                    type="checkbox"
                    checked={requiredEquipment.includes(item)}
                    onChange={() => toggleEquipment(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {matchingRooms.length === 0 ? (
          <div className="empty-state" role="status">
            <strong>No rooms match these requirements.</strong>
            <span>Reduce the attendee count or remove equipment filters.</span>
          </div>
        ) : (
          <div className="room-grid" aria-label="Matching rooms">
            {matchingRooms.map(room => (
              <button
                className={`room-card ${room.id === roomId ? 'selected' : ''}`}
                type="button"
                key={room.id}
                onClick={() => { setRoomId(room.id); setResult(null); setError(''); }}
              >
                <span className="room-card-top"><strong>{room.name}</strong>{room.blocked && <em>Blocked</em>}</span>
                <span>{room.capacity} seats</span>
                <small>{room.equipment.join(' · ')}</small>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedRoom && (
        <section className="panel" aria-labelledby="availability-heading">
          <div className="section-heading">
            <div><span className="step">02</span><h2 id="availability-heading">Check availability</h2></div>
            <span className="selected-name">{selectedRoom.name}</span>
          </div>

          <div className="time-grid">
            <label>Current time<input type="time" value={now} onChange={event => { setNow(event.target.value); setResult(null); }} /></label>
            <label>Start<input type="time" value={start} onChange={event => { setStart(event.target.value); setResult(null); }} /></label>
            <label>End<input type="time" value={end} disabled={endOfDay} onChange={event => { setEnd(event.target.value); setResult(null); }} /></label>
          </div>

          <label className="end-of-day">
            <input type="checkbox" checked={endOfDay} onChange={event => { setEndOfDay(event.target.checked); setResult(null); }} />
            Ends at 24:00
          </label>

          <div className="availability-actions">
            <button className="primary-button" type="button" onClick={checkAvailability}>Check availability</button>
            {error && <p className="error" role="alert">{error}</p>}
            {result !== null && (
              <p className={`result ${result ? 'available' : 'unavailable'}`} role="status">
                <span>{result ? 'Available' : 'Unavailable'}</span>
                {result ? 'This room can be booked for the selected time.' : 'Try another room or time.'}
              </p>
            )}
          </div>

          <div className="bookings">
            <h3>Existing bookings</h3>
            {selectedRoom.bookings.length ? (
              <ul>{selectedRoom.bookings.map(booking => <li key={`${booking.start}-${booking.end}`}>{formatMinutes(booking.start)}–{formatMinutes(booking.end)}</li>)}</ul>
            ) : <p>No bookings today</p>}
          </div>
        </section>
      )}
    </main>
  );
}
