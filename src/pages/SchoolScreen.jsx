import { useState } from 'react'
import SubjectModal from '../components/SubjectModal'
import UnitModal from '../components/UnitModal'
import GradeModal from '../components/GradeModal'

function getColor(pct) {
  if (pct >= 90) return '#10b981'
  if (pct >= 70) return '#f59e0b'
  if (pct >= 50) return '#f97316'
  return '#ef4444'
}

function PercentBadge({ value, size = 'md' }) {
  if (value === null || value === undefined) return <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
  const color = getColor(value)
  const fontSize = size === 'lg' ? 20 : size === 'sm' ? 12 : 14
  return (
    <span style={{ fontSize, fontWeight: 800, color, letterSpacing: '-0.02em' }}>
      {value}%
    </span>
  )
}

function ProgressRing({ value, size = 48, stroke = 4 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = value ?? 0
  const offset = circ - (pct / 100) * circ
  const color = value !== null ? getColor(pct) : 'rgba(255,255,255,0.08)'

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      {value !== null && (
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      )}
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="var(--text-primary)" fontSize={size * 0.22} fontWeight="800">
        {value !== null ? `${Math.round(pct)}` : '—'}
      </text>
    </svg>
  )
}

// ═════════════════════════════════════════════════════
//  SUBJECTS LIST
// ═════════════════════════════════════════════════════
function SubjectsList({ subjects, getSubjectAverage, getUnitsForSubject, onSelect, onAdd, onEdit, onDelete, getGlobalAverage }) {
  const globalAvg = getGlobalAverage()

  return (
    <>
      <div className="page-header">
        <h1>Mi <span className="gradient-text">Rendimiento</span></h1>
        <p>Rastrea tus calificaciones por materia</p>
      </div>

      {/* Global average card */}
      {subjects.length > 0 && globalAvg !== null && (
        <div className="school-avg-banner" style={{
          background: 'linear-gradient(135deg, #1e3a5f, #1e40af, #3b82f6)',
          borderRadius: 'var(--radius-lg)', padding: 20,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 8px 32px rgba(59,130,246,0.35)',
          marginBottom: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
          <ProgressRing value={globalAvg} size={64} stroke={5} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>{globalAvg}%</div>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Promedio general</div>
          </div>
        </div>
      )}

      <p className="section-title">Mis materias</p>

      {subjects.length === 0 ? (
        <div className="empty-state">
          <span className="emoji">🎓</span>
          <h3>Sin materias todavía</h3>
          <p>Toca el botón <strong>+</strong> para agregar tu primera materia</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {subjects.map(sub => {
            const avg = getSubjectAverage(sub.id)
            const unitCount = getUnitsForSubject(sub.id).length
            return (
              <button
                key={sub.id}
                className="school-card"
                onClick={() => onSelect(sub)}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <div style={{ fontSize: 28 }}>{sub.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {unitCount} {unitCount === 1 ? 'unidad' : 'unidades'}
                  </div>
                </div>
                <PercentBadge value={avg} />
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" width="16" height="16" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" /></svg>
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

// ═════════════════════════════════════════════════════
//  UNIT LIST (inside a subject)
// ═════════════════════════════════════════════════════
function UnitsList({ subject, units, getUnitAverage, getGradesForUnit, onSelect, onBack, onAddUnit, onDeleteUnit }) {
  return (
    <>
      <button className="school-back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><path d="M15 18l-6-6 6-6" /></svg>
        Materias
      </button>

      <div className="page-header" style={{ marginTop: 8 }}>
        <h1>{subject.emoji} <span className="gradient-text">{subject.name}</span></h1>
        <p>Unidades y calificaciones</p>
      </div>

      {units.length === 0 ? (
        <div className="empty-state">
          <span className="emoji">📂</span>
          <h3>Sin unidades</h3>
          <p>Agrega la primera unidad de esta materia</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {units.map(unit => {
            const avg = getUnitAverage(unit.id)
            const gradeCount = getGradesForUnit(unit.id).length
            return (
              <div key={unit.id} className="school-card" style={{ position: 'relative' }}>
                <button
                  onClick={() => onSelect(unit)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${subject.color}22`, color: subject.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 15, flexShrink: 0
                  }}>
                    U{unit.unit_number}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{unit.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {gradeCount} {gradeCount === 1 ? 'calificación' : 'calificaciones'}
                    </div>
                  </div>
                  <PercentBadge value={avg} />
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" width="14" height="14"><path d="M9 18l6-6-6-6" /></svg>
                </button>
                <button
                  className="btn btn-danger btn-icon"
                  style={{ width: 32, height: 32, fontSize: 13, position: 'absolute', top: 8, right: 8 }}
                  onClick={(e) => { e.stopPropagation(); onDeleteUnit(unit.id) }}
                  title="Eliminar unidad"
                >🗑️</button>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

// ═════════════════════════════════════════════════════
//  GRADES LIST (inside a unit)
// ═════════════════════════════════════════════════════
function GradesList({ subject, unit, grades, unitAverage, onBack, onAddGrade, onEditGrade, onDeleteGrade }) {
  const activities = grades.filter(g => g.type === 'activity')
  const exams = grades.filter(g => g.type === 'exam')

  const avgActivities = activities.length > 0 ? Math.round(activities.reduce((a, c) => a + Number(c.percentage), 0) / activities.length * 10) / 10 : null
  const avgExams = exams.length > 0 ? Math.round(exams.reduce((a, c) => a + Number(c.percentage), 0) / exams.length * 10) / 10 : null

  return (
    <>
      <button className="school-back-btn" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><path d="M15 18l-6-6 6-6" /></svg>
        {subject.name}
      </button>

      <div className="page-header" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12, color: subject.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Unidad {unit.unit_number}
        </div>
        <h1>{unit.name}</h1>
      </div>

      {/* Unit stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: 24 }}>
            {unitAverage !== null ? `${unitAverage}%` : '—'}
          </div>
          <div className="stat-label">Promedio</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: 24, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {avgActivities !== null ? `${avgActivities}%` : '—'}
          </div>
          <div className="stat-label">Actividades</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: 24, background: 'linear-gradient(135deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {avgExams !== null ? `${avgExams}%` : '—'}
          </div>
          <div className="stat-label">Exámenes</div>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="empty-state">
          <span className="emoji">📝</span>
          <h3>Sin calificaciones</h3>
          <p>Agrega actividades y exámenes con el botón <strong>+</strong></p>
        </div>
      ) : (
        <>
          {/* Activities */}
          {activities.length > 0 && (
            <>
              <p className="section-title">📋 Actividades ({activities.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {activities.map(g => (
                  <GradeItem key={g.id} grade={g} color={subject.color} onEdit={() => onEditGrade(g)} onDelete={() => onDeleteGrade(g.id)} />
                ))}
              </div>
            </>
          )}

          {/* Exams */}
          {exams.length > 0 && (
            <>
              <p className="section-title">📄 Exámenes ({exams.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {exams.map(g => (
                  <GradeItem key={g.id} grade={g} color={subject.color} onEdit={() => onEditGrade(g)} onDelete={() => onDeleteGrade(g.id)} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

function GradeItem({ grade, color, onEdit, onDelete }) {
  const pctColor = getColor(Number(grade.percentage))
  return (
    <div className="school-card" style={{ padding: '10px 14px' }}>
      <div style={{
        width: 6, height: 28, borderRadius: 3, flexShrink: 0,
        background: grade.type === 'exam' ? '#f59e0b' : color,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {grade.title}
        </div>
      </div>
      <span style={{ fontSize: 16, fontWeight: 800, color: pctColor, letterSpacing: '-0.02em', flexShrink: 0 }}>
        {Number(grade.percentage)}%
      </span>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button className="btn btn-ghost btn-icon" style={{ width: 28, height: 28, fontSize: 12 }} onClick={onEdit}>✏️</button>
        <button className="btn btn-danger btn-icon" style={{ width: 28, height: 28, fontSize: 12 }} onClick={onDelete}>🗑️</button>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════
//  MAIN SCHOOL SCREEN
// ═════════════════════════════════════════════════════
export default function SchoolScreen({
  subjects, addSubject, updateSubject, deleteSubject,
  addUnit, deleteUnit,
  addGrade, updateGrade, deleteGrade,
  getUnitsForSubject, getGradesForUnit,
  getUnitAverage, getSubjectAverage, getGlobalAverage,
  addToast,
}) {
  // Navigation: 'list' | 'units' | 'grades'
  const [view, setView] = useState('list')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(null)

  // Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [editSubject, setEditSubject] = useState(null)
  const [showUnitModal, setShowUnitModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [editGrade, setEditGrade] = useState(null)

  // ── Subject handlers ──────────────────────────────
  const handleSelectSubject = (sub) => {
    setSelectedSubject(sub)
    setView('units')
  }

  const handleAddSubject = async (data) => {
    const { error } = await addSubject(data.name, data.emoji, data.color)
    if (error) addToast('Error al crear materia', 'error')
    else addToast('¡Materia creada! 📚')
    setShowSubjectModal(false)
  }

  const handleDeleteSubject = async (id) => {
    const { error } = await deleteSubject(id)
    if (error) addToast('Error al eliminar', 'error')
    else addToast('Materia eliminada')
  }

  // ── Unit handlers ─────────────────────────────────
  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit)
    setView('grades')
  }

  const handleAddUnit = async (data) => {
    const { error } = await addUnit(selectedSubject.id, data.name, data.unit_number)
    if (error) addToast('Error al crear unidad', 'error')
    else addToast('¡Unidad creada! 📂')
    setShowUnitModal(false)
  }

  const handleDeleteUnit = async (id) => {
    const { error } = await deleteUnit(id)
    if (error) addToast('Error al eliminar', 'error')
    else addToast('Unidad eliminada')
  }

  // ── Grade handlers ────────────────────────────────
  const handleAddGrade = async (data) => {
    const { error } = await addGrade(selectedUnit.id, data.title, data.percentage, data.type)
    if (error) addToast('Error al agregar', 'error')
    else addToast('¡Calificación agregada! 📝')
    setShowGradeModal(false)
  }

  const handleEditGrade = async (data) => {
    const { error } = await updateGrade(editGrade.id, data)
    if (error) addToast('Error al actualizar', 'error')
    else addToast('Calificación actualizada ✅')
    setEditGrade(null)
  }

  const handleDeleteGrade = async (id) => {
    const { error } = await deleteGrade(id)
    if (error) addToast('Error al eliminar', 'error')
    else addToast('Calificación eliminada')
  }

  // ── What FAB does ─────────────────────────────────
  const handleFab = () => {
    if (view === 'list') setShowSubjectModal(true)
    else if (view === 'units') setShowUnitModal(true)
    else if (view === 'grades') setShowGradeModal(true)
  }

  const fabLabel = view === 'list' ? 'Nueva materia' : view === 'units' ? 'Nueva unidad' : 'Nueva calificación'

  return (
    <div className="page">
      {view === 'list' && (
        <SubjectsList
          subjects={subjects}
          getSubjectAverage={getSubjectAverage}
          getUnitsForSubject={getUnitsForSubject}
          getGlobalAverage={getGlobalAverage}
          onSelect={handleSelectSubject}
          onAdd={() => setShowSubjectModal(true)}
          onEdit={(s) => setEditSubject(s)}
          onDelete={handleDeleteSubject}
        />
      )}

      {view === 'units' && selectedSubject && (
        <UnitsList
          subject={selectedSubject}
          units={getUnitsForSubject(selectedSubject.id)}
          getUnitAverage={getUnitAverage}
          getGradesForUnit={getGradesForUnit}
          onSelect={handleSelectUnit}
          onBack={() => { setView('list'); setSelectedSubject(null) }}
          onAddUnit={() => setShowUnitModal(true)}
          onDeleteUnit={handleDeleteUnit}
        />
      )}

      {view === 'grades' && selectedUnit && (
        <GradesList
          subject={selectedSubject}
          unit={selectedUnit}
          grades={getGradesForUnit(selectedUnit.id)}
          unitAverage={getUnitAverage(selectedUnit.id)}
          onBack={() => { setView('units'); setSelectedUnit(null) }}
          onAddGrade={() => setShowGradeModal(true)}
          onEditGrade={(g) => setEditGrade(g)}
          onDeleteGrade={handleDeleteGrade}
        />
      )}

      {/* FAB */}
      <button className="fab" onClick={handleFab} aria-label={fabLabel}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="24" height="24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Modals */}
      {showSubjectModal && <SubjectModal onSave={handleAddSubject} onClose={() => setShowSubjectModal(false)} />}
      {editSubject && <SubjectModal onSave={async (d) => { await updateSubject(editSubject.id, d); setEditSubject(null) }} onClose={() => setEditSubject(null)} initial={editSubject} />}
      {showUnitModal && (
        <UnitModal
          onSave={handleAddUnit}
          onClose={() => setShowUnitModal(false)}
          nextNumber={getUnitsForSubject(selectedSubject.id).length + 1}
        />
      )}
      {showGradeModal && <GradeModal onSave={handleAddGrade} onClose={() => setShowGradeModal(false)} />}
      {editGrade && <GradeModal onSave={handleEditGrade} onClose={() => setEditGrade(null)} initial={editGrade} />}
    </div>
  )
}
