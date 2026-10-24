import { useState } from 'react'

const DAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatDate(date) {
  const d = new Date(date)
  return `${DAYS_ES[d.getDay()]}, ${d.getDate()} de ${MONTHS_ES[d.getMonth()]}`
}

export default function HomeScreen({ habits, completions, today, toggleCompletion, getStreak, getGlobalStreak }) {
  const [pending, setPending] = useState(new Set())

  const todayDoneIds = completions[today] || []
  const doneCount = todayDoneIds.length
  const totalCount = habits.length
  const progress = totalCount > 0 ? doneCount / totalCount : 0

  const globalStreak = getGlobalStreak()
  const allDone = totalCount > 0 && doneCount === totalCount

  const handleToggle = async (habitId) => {
    if (pending.has(habitId)) return
    setPending(p => new Set(p).add(habitId))
    await toggleCompletion(habitId, today)
    setPending(p => { const n = new Set(p); n.delete(habitId); return n })
  }

  return (
    <div className="page">
      {/* Date */}
      <div className="page-header">
        <div className="date-badge">{formatDate(new Date())}</div>
        <h1 style={{ marginTop: 8 }}>
          {allDone
            ? <><span className="gradient-text">¡Perfecto! 🎉</span></>
            : <>Hoy, <span className="gradient-text">¿qué lograste?</span></>
          }
        </h1>
        <p>{doneCount} de {totalCount} hábitos completados</p>
      </div>

      {/* Streak Banner */}
      <div className="streak-banner">
        <div className="streak-fire">🔥</div>
        <div className="streak-info">
          <div className="streak-number">{globalStreak}</div>
          <div className="streak-label">
            {globalStreak === 1 ? 'día de racha' : 'días de racha'}
          </div>
        </div>
        <div style={{ textAlign: 'right', position: 'relative' }}>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1 }}>
            {doneCount}/{totalCount}
          </div>
          <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            hoy
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="progress-row">
          <span className="progress-label">Progreso del día</span>
          <span className="progress-count">{Math.round(progress * 100)}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Habits */}
      <p className="section-title">Mis hábitos</p>

      {habits.length === 0 ? (
        <div className="empty-state">
          <span className="emoji">🌱</span>
          <h3>Sin hábitos todavía</h3>
          <p>Ve a la pestaña de <strong>Hábitos</strong> para crear tu primera actividad</p>
        </div>
      ) : (
        <div className="habits-list">
          {habits.map(habit => {
            const isDone = todayDoneIds.includes(habit.id)
            const streak = getStreak(habit.id)
            const isLoading = pending.has(habit.id)

            return (
              <button
                key={habit.id}
                className={`habit-item ${isDone ? 'completed' : ''}`}
                onClick={() => handleToggle(habit.id)}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.6 : 1,
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <div className="habit-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <span className="habit-emoji">{habit.emoji}</span>

                <div className="habit-info">
                  <div className="habit-name">{habit.name}</div>
                </div>

                {streak > 0 && (
                  <div className="habit-streak-badge">
                    🔥 {streak}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
