import { useState } from 'react'
import HabitModal from '../components/HabitModal'

export default function HabitsScreen({ habits, addHabit, updateHabit, deleteHabit, getStreak }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editHabit, setEditHabit] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleAdd = async (data) => {
    await addHabit(data.name, data.emoji, data.color)
    setShowAdd(false)
  }

  const handleEdit = async (data) => {
    await updateHabit(editHabit.id, data)
    setEditHabit(null)
  }

  const handleDelete = async (id) => {
    setDeleting(id)
    await deleteHabit(id)
    setDeleting(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mis <span className="gradient-text">Hábitos</span></h1>
        <p>Gestiona tu lista de actividades diarias</p>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <span className="emoji">🌱</span>
          <h3>Crea tu primer hábito</h3>
          <p>Toca el botón <strong>+</strong> para agregar una nueva actividad diaria</p>
        </div>
      ) : (
        <div className="habit-manage-list">
          {habits.map(habit => {
            const streak = getStreak(habit.id)
            return (
              <div key={habit.id} className="habit-manage-item">
                <span style={{ fontSize: 24 }}>{habit.emoji}</span>

                <div className="habit-manage-info">
                  <div className="habit-manage-name">{habit.name}</div>
                  {streak > 0 && (
                    <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 2 }}>
                      🔥 {streak} {streak === 1 ? 'día' : 'días'} de racha
                    </div>
                  )}
                </div>

                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: habit.color || '#7c3aed',
                    marginRight: 4,
                    flexShrink: 0,
                  }}
                />

                <div className="habit-manage-actions">
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setEditHabit(habit)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-danger btn-icon"
                    onClick={() => handleDelete(habit.id)}
                    disabled={deleting === habit.id}
                    title="Eliminar"
                  >
                    {deleting === habit.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setShowAdd(true)} aria-label="Nuevo hábito">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="24" height="24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Modals */}
      {showAdd && (
        <HabitModal onSave={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {editHabit && (
        <HabitModal onSave={handleEdit} onClose={() => setEditHabit(null)} initial={editHabit} />
      )}
    </div>
  )
}
