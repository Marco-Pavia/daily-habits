import { useState } from 'react'

const EMOJIS = ['💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🎯', '✏️', '🎵', '🧹', '🌿', '⭐', '❤️', '🔥', '🧠', '🏋️', '🚴', '🍎', '🌙']
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
      {/* ✅ El modal-sheet ahora es flex column con altura máxima limitada */}
      <div
        className="modal-sheet"
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(90dvh - env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="modal-handle" />
        <div className="modal-title">
          {initial ? '✏️ Editar hábito' : '✨ Nuevo hábito'}
        </div>

        {/* ✅ El form ocupa el espacio restante y permite que el área interna haga scroll */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0, // ✅ crítico para que flex + scroll funcionen
          }}
        >
          {/* ✅ Área scrollable: ocupa solo el espacio disponible */}
          <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: 2 }}>
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

            <div className="form-group" style={{ marginBottom: 4 }}>
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
          </div>

          {/* ✅ Botones fijos al fondo, siempre visibles, con safe-area */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: 16,
              paddingTop: 12,
              paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))', // ✅ compensa la gesture bar
              borderTop: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}
          >
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