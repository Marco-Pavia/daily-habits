import { useState } from 'react'

export default function GradeModal({ onSave, onClose, initial = null }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [percentage, setPercentage] = useState(initial?.percentage ?? '')
  const [type, setType] = useState(initial?.type || 'activity')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || percentage === '' || percentage < 0 || percentage > 100) return
    setSaving(true)
    await onSave({ title: title.trim(), percentage: Number(percentage), type })
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
          {initial ? '✏️ Editar calificación' : '📝 Nueva calificación'}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type toggle */}
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className={`btn ${type === 'activity' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1, fontSize: 13 }}
                onClick={() => setType('activity')}
              >
                📋 Actividad
              </button>
              <button
                type="button"
                className={`btn ${type === 'exam' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ flex: 1, fontSize: 13 }}
                onClick={() => setType('exam')}
              >
                📄 Examen
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Título</label>
            <input
              className="form-input"
              placeholder={type === 'exam' ? 'Ej: Examen parcial 1' : 'Ej: Tarea 3, Práctica...'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              maxLength={80}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Porcentaje obtenido (%)</label>
            <input
              className="form-input"
              type="number"
              min={0}
              max={100}
              step={0.1}
              placeholder="85"
              value={percentage}
              onChange={e => setPercentage(e.target.value)}
              style={{ fontSize: 24, fontWeight: 800, textAlign: 'center', letterSpacing: '-0.03em' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={!title.trim() || percentage === '' || saving}>
              {saving ? 'Guardando...' : initial ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
