import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSchool() {
  const [subjects, setSubjects] = useState([])
  const [units, setUnits] = useState([])       // all units across subjects
  const [grades, setGrades] = useState([])      // all grades across units
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Fetch all ─────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [sRes, uRes, gRes] = await Promise.all([
      supabase.from('subjects').select('*').order('created_at', { ascending: true }),
      supabase.from('units').select('*').order('unit_number', { ascending: true }),
      supabase.from('grades').select('*').order('created_at', { ascending: true }),
    ])
    if (sRes.error) setError(sRes.error.message)
    else setSubjects(sRes.data || [])

    if (uRes.error) setError(uRes.error.message)
    else setUnits(uRes.data || [])

    if (gRes.error) setError(gRes.error.message)
    else setGrades(gRes.data || [])

    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ═══════════════════════════════════════════════════
  //  SUBJECTS (materias)
  // ═══════════════════════════════════════════════════

  const addSubject = useCallback(async (name, emoji = '📘', color = '#3b82f6') => {
    const { data, error } = await supabase
      .from('subjects').insert({ name, emoji, color }).select().single()
    if (!error && data) setSubjects(prev => [...prev, data])
    return { data, error }
  }, [])

  const updateSubject = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('subjects').update(updates).eq('id', id).select().single()
    if (!error && data) setSubjects(prev => prev.map(s => s.id === id ? data : s))
    return { data, error }
  }, [])

  const deleteSubject = useCallback(async (id) => {
    const { error } = await supabase.from('subjects').delete().eq('id', id)
    if (!error) {
      setSubjects(prev => prev.filter(s => s.id !== id))
      // cascade: also remove units & grades locally
      const unitIds = units.filter(u => u.subject_id === id).map(u => u.id)
      setUnits(prev => prev.filter(u => u.subject_id !== id))
      setGrades(prev => prev.filter(g => !unitIds.includes(g.unit_id)))
    }
    return { error }
  }, [units])

  // ═══════════════════════════════════════════════════
  //  UNITS (unidades)
  // ═══════════════════════════════════════════════════

  const addUnit = useCallback(async (subjectId, name, unitNumber) => {
    const { data, error } = await supabase
      .from('units').insert({ subject_id: subjectId, name, unit_number: unitNumber }).select().single()
    if (!error && data) setUnits(prev => [...prev, data])
    return { data, error }
  }, [])

  const updateUnit = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('units').update(updates).eq('id', id).select().single()
    if (!error && data) setUnits(prev => prev.map(u => u.id === id ? data : u))
    return { data, error }
  }, [])

  const deleteUnit = useCallback(async (id) => {
    const { error } = await supabase.from('units').delete().eq('id', id)
    if (!error) {
      setUnits(prev => prev.filter(u => u.id !== id))
      setGrades(prev => prev.filter(g => g.unit_id !== id))
    }
    return { error }
  }, [])

  // ═══════════════════════════════════════════════════
  //  GRADES (calificaciones)
  // ═══════════════════════════════════════════════════

  const addGrade = useCallback(async (unitId, title, percentage, type = 'activity') => {
    const { data, error } = await supabase
      .from('grades').insert({ unit_id: unitId, title, percentage, type }).select().single()
    if (!error && data) setGrades(prev => [...prev, data])
    return { data, error }
  }, [])

  const updateGrade = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('grades').update(updates).eq('id', id).select().single()
    if (!error && data) setGrades(prev => prev.map(g => g.id === id ? data : g))
    return { data, error }
  }, [])

  const deleteGrade = useCallback(async (id) => {
    const { error } = await supabase.from('grades').delete().eq('id', id)
    if (!error) setGrades(prev => prev.filter(g => g.id !== id))
    return { error }
  }, [])

  // ═══════════════════════════════════════════════════
  //  COMPUTED helpers
  // ═══════════════════════════════════════════════════

  /** Get units for a specific subject */
  const getUnitsForSubject = useCallback((subjectId) => {
    return units.filter(u => u.subject_id === subjectId).sort((a, b) => a.unit_number - b.unit_number)
  }, [units])

  /** Get grades for a specific unit */
  const getGradesForUnit = useCallback((unitId) => {
    return grades.filter(g => g.unit_id === unitId)
  }, [grades])

  /** Average for a unit */
  const getUnitAverage = useCallback((unitId) => {
    const g = grades.filter(g => g.unit_id === unitId)
    if (g.length === 0) return null
    const sum = g.reduce((acc, cur) => acc + Number(cur.percentage), 0)
    return Math.round((sum / g.length) * 10) / 10
  }, [grades])

  /** Average for a subject (average of all its grades) */
  const getSubjectAverage = useCallback((subjectId) => {
    const subjectUnits = units.filter(u => u.subject_id === subjectId)
    const subjectGrades = grades.filter(g => subjectUnits.some(u => u.id === g.unit_id))
    if (subjectGrades.length === 0) return null
    const sum = subjectGrades.reduce((acc, cur) => acc + Number(cur.percentage), 0)
    return Math.round((sum / subjectGrades.length) * 10) / 10
  }, [units, grades])

  /** Global average across all subjects */
  const getGlobalAverage = useCallback(() => {
    if (grades.length === 0) return null
    const sum = grades.reduce((acc, cur) => acc + Number(cur.percentage), 0)
    return Math.round((sum / grades.length) * 10) / 10
  }, [grades])

  /** Count grades by type */
  const getGradeCountByType = useCallback((unitId, type) => {
    return grades.filter(g => g.unit_id === unitId && g.type === type).length
  }, [grades])

  return {
    subjects, units, grades,
    loading, error,
    // Subjects
    addSubject, updateSubject, deleteSubject,
    // Units
    addUnit, updateUnit, deleteUnit,
    // Grades
    addGrade, updateGrade, deleteGrade,
    // Helpers
    getUnitsForSubject, getGradesForUnit,
    getUnitAverage, getSubjectAverage, getGlobalAverage,
    getGradeCountByType,
    refetch: fetchAll,
  }
}
