import { FormEvent, useMemo, useState } from 'react'
import { canBook, type Booking, type Room } from './booking.ts'

const room: Room = { id: 'north-204', name: 'North Hall 204', blocked: false }
const bookings: readonly Booking[] = [
  { roomId: room.id, start: '2030-05-10T10:00:00', end: '2030-05-10T11:00:00' },
  { roomId: room.id, start: '2030-05-10T14:00:00', end: '2030-05-10T15:30:00' },
]

type Status = { tone: 'idle' | 'available' | 'unavailable'; message: string }

export default function App() {
  const [start, setStart] = useState('2030-05-10T11:00')
  const [end, setEnd] = useState('2030-05-10T12:00')
  const [status, setStatus] = useState<Status>({
    tone: 'idle',
    message: 'Choose an interval to check this room.',
  })

  const schedule = useMemo(
    () => bookings.map((booking) => `${booking.start.slice(11, 16)}–${booking.end.slice(11, 16)}`),
    [],
  )

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = canBook({ roomId: room.id, start, end }, room, bookings)
    setStatus({ tone: result.available ? 'available' : 'unavailable', message: result.reason })
  }

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Smart Campus · Room checker</p>
        <h1 id="page-title">Find a quiet hour between classes.</h1>
        <p className="intro">One fictional room, one clear answer, and no booking data is changed.</p>
      </section>

      <section className="checker" aria-label="Availability checker">
        <div className="room-heading">
          <div>
            <span className="label">Selected room</span>
            <h2>{room.name}</h2>
          </div>
          <span className="room-state">Open for checks</span>
        </div>

        <div className="schedule" aria-label="Existing bookings">
          <span className="label">Booked on 10 May 2030</span>
          <div>{schedule.map((time) => <span className="booking" key={time}>{time}</span>)}</div>
        </div>

        <form onSubmit={submit}>
          <label>
            Start
            <input type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} required />
          </label>
          <label>
            End
            <input type="datetime-local" value={end} onChange={(event) => setEnd(event.target.value)} required />
          </label>
          <button type="submit">Check availability</button>
        </form>

        <div className={`result ${status.tone}`} role="status" aria-live="polite">
          <span className="result-dot" aria-hidden="true" />
          <div><strong>{status.tone === 'idle' ? 'Ready when you are' : status.tone === 'available' ? 'Available' : 'Unavailable'}</strong><p>{status.message}</p></div>
        </div>
      </section>
    </main>
  )
}
