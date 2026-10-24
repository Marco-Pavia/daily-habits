import { useState } from 'react'

export default function UnitModal({ onSave, onClose, initial = null, nextNumber = 1 }) {
  const [name, setName] = useState(initial?.name || '')
  const [unitNumber, setUnitNumber] = useState(initial?.unit_number || nextNumber)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await onSave({ name: name.trim(), unit_number: unitNumber })
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
          {initial ? '✏️ Editar unidad' : '📂 Nueva unidad'}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Número de unidad</label>
            <input
              className="form-input"
              type="number"
              min={1}
              max={20}
              value={unitNumber}
              onChange={e => setUnitNumber(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de la unidad</label>
            <input
              className="form-input"
              placeholder="Ej: Derivadas, Cinemática, POO..."
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              maxLength={60}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={!name.trim() || saving}>
              {saving ? 'Guardando...' : initial ? 'Guardar' : 'Crear unidad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
