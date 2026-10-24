import { useState } from 'react'

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function CalendarView({ getDayStatus }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const todayStr = toDateStr(today)

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1)
    if (next <= today) setViewDate(next)
  }

  // Build grid cells
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      {/* Header */}
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="calendar-month-title">
          {MONTHS[month]} {year}
        </span>
        <button
          className="calendar-nav-btn"
          onClick={nextMonth}
          disabled={month === today.getMonth() && year === today.getFullYear()}
          style={{ opacity: (month === today.getMonth() && year === today.getFullYear()) ? 0.3 : 1 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="calendar-grid">
        {DAYS.map(d => (
          <div key={d} className="calendar-day-label">{d}</div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const cellDate = new Date(year, month, day)
          const dateStr = toDateStr(cellDate)
          const isToday = dateStr === todayStr
          const isFuture = cellDate > today

          const status = isFuture ? 'future' : getDayStatus(cellDate)

          return (
            <div
              key={dateStr}
              className={`calendar-day ${isToday ? 'today' : ''} status-${status}`}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.5))' }} />
          <span>Todo completado</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(245,158,11,0.4)' }} />
          <span>Parcial</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }} />
          <span>Sin completar</span>
        </div>
      </div>
    </div>
  )
}
