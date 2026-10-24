import { useState } from 'react'

const EMOJIS = ['💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🎯', '🖊️', '🎵', '🧹', '🌿', '⭐', '❤️', '🔥', '🧠', '🏋️', '🚴', '🍎', '🌙']
const COLORS = ['#7c3aed', '#a855f7', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#06b6d4', '#84cc16', '#f97316']

export default function HabitModal({ onSave, onClose, initial = null }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '⭐')
  const [color, setColor] = useState(initial?.color || '#7c3aed')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await onSave({ name: name.trim(), emoji, color })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">
          {initial ? '✏️ Editar hábito' : '✨ Nuevo hábito'}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre del hábito</label>
            <input
              className="form-input"
              placeholder="Ej: Ejercicio, Leer, Meditar..."
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Emoji</label>
            <div className="emoji-picker-row">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  className={`emoji-option ${emoji === e ? 'selected' : ''}`}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Color</label>
            <div className="color-picker-row">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`color-option ${color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
              disabled={!name.trim() || saving}
            >
              {saving ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear hábito'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
