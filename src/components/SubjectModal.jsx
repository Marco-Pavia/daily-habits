import { useState } from 'react'

const EMOJIS = ['📘', '📐', '🧪', '💻', '📊', '🌍', '🧮', '📖', '🎨', '⚙️', '🔬', '📝', '🏛️', '🎭', '🧬', '🏀']
const COLORS = ['#3b82f6', '#7c3aed', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#84cc16', '#f97316', '#8b5cf6']

export default function SubjectModal({ onSave, onClose, initial = null }) {
  const [name, setName] = useState(initial?.name || '')
  const [emoji, setEmoji] = useState(initial?.emoji || '📘')
  const [color, setColor] = useState(initial?.color || '#3b82f6')
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
      <div
        className="modal-sheet"
        style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(90dvh - env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="modal-handle" />
        <div className="modal-title">
          {initial ? '✏️ Editar materia' : '📚 Nueva materia'}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, paddingRight: 2 }}>
            <div className="form-group">
              <label className="form-label">Nombre de la materia</label>
              <input
                className="form-input"
                placeholder="Ej: Matemáticas, Física, Programación..."
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                maxLength={60}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emoji</label>
              <div className="emoji-picker-row">
                {EMOJIS.map(e => (
                  <button key={e} type="button" className={`emoji-option ${emoji === e ? 'selected' : ''}`} onClick={() => setEmoji(e)}>{e}</button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 4 }}>
              <label className="form-label">Color</label>
              <div className="color-picker-row">
                {COLORS.map(c => (
                  <button key={c} type="button" className={`color-option ${color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={!name.trim() || saving}>
              {saving ? 'Guardando...' : initial ? 'Guardar' : 'Crear materia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
