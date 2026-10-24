import CalendarView from '../components/CalendarView'

export default function CalendarScreen({ getDayStatus, getGlobalStreak, completions, habits, toDateStr }) {
  const globalStreak = getGlobalStreak()

  // Calculate best streak from completions data
  const calcBestStreak = () => {
    if (habits.length === 0) return 0
    let best = 0
    let current = 0
    const cursor = new Date()
    cursor.setDate(cursor.getDate() - 89) // last 90 days

    for (let i = 0; i < 90; i++) {
      const dateStr = toDateStr(cursor)
      const doneIds = completions[dateStr] || []
      const allDone = habits.every(h => doneIds.includes(h.id))
      if (allDone) {
        current++
        if (current > best) best = current
      } else {
        current = 0
      }
      cursor.setDate(cursor.getDate() + 1)
    }
    return best
  }

  // Count perfect days
  const countPerfectDays = () => {
    let count = 0
    const cursor = new Date()
    for (let i = 0; i < 90; i++) {
      const dateStr = toDateStr(cursor)
      const doneIds = completions[dateStr] || []
      if (habits.length > 0 && habits.every(h => doneIds.includes(h.id))) count++
      cursor.setDate(cursor.getDate() - 1)
    }
    return count
  }

  const bestStreak = calcBestStreak()
  const perfectDays = countPerfectDays()

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mi <span className="gradient-text">Cronología</span></h1>
        <p>Tu constancia en el tiempo</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-value">{globalStreak}</div>
          <div className="stat-label">Racha actual 🔥</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bestStreak}</div>
          <div className="stat-label">Mejor racha 🏆</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{perfectDays}</div>
          <div className="stat-label">Días perfectos ✨</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{habits.length}</div>
          <div className="stat-label">Hábitos activos 💪</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card">
        <CalendarView getDayStatus={getDayStatus} />
      </div>
    </div>
  )
}
