import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const toDateStr = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useHabits() {
  const [habits, setHabits] = useState([])
  const [completions, setCompletions] = useState({}) // { 'YYYY-MM-DD': [habit_id, ...] }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const today = toDateStr(new Date())

  // ── Fetch habits ──────────────────────────────────────────────
  const fetchHabits = useCallback(async () => {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) setError(error.message)
    else setHabits(data || [])
  }, [])

  // ── Fetch completions (last 90 days) ──────────────────────────
  const fetchCompletions = useCallback(async () => {
    const since = new Date()
    since.setDate(since.getDate() - 90)
    const sinceStr = toDateStr(since)

    const { data, error } = await supabase
      .from('completions')
      .select('habit_id, completed_date')
      .gte('completed_date', sinceStr)

    if (error) {
      setError(error.message)
      return
    }

    // Group by date
    const grouped = {}
    for (const row of data || []) {
      if (!grouped[row.completed_date]) grouped[row.completed_date] = []
      grouped[row.completed_date].push(row.habit_id)
    }
    setCompletions(grouped)
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchHabits(), fetchCompletions()])
      setLoading(false)
    }
    init()
  }, [fetchHabits, fetchCompletions])

  // ── Toggle completion ─────────────────────────────────────────
  const toggleCompletion = useCallback(async (habitId, date = today) => {
    const doneIds = completions[date] || []
    const isDone = doneIds.includes(habitId)

    if (isDone) {
      // Remove
      const { error } = await supabase
        .from('completions')
        .delete()
        .eq('habit_id', habitId)
        .eq('completed_date', date)

      if (!error) {
        setCompletions(prev => ({
          ...prev,
          [date]: (prev[date] || []).filter(id => id !== habitId)
        }))
      }
    } else {
      // Add
      const { error } = await supabase
        .from('completions')
        .insert({ habit_id: habitId, completed_date: date })

      if (!error) {
        setCompletions(prev => ({
          ...prev,
          [date]: [...(prev[date] || []), habitId]
        }))
      }
    }
  }, [completions, today])

  // ── Add habit ─────────────────────────────────────────────────
  const addHabit = useCallback(async (name, emoji = '⭐', color = '#7c3aed') => {
    const { data, error } = await supabase
      .from('habits')
      .insert({ name, emoji, color })
      .select()
      .single()

    if (!error && data) {
      setHabits(prev => [...prev, data])
    }
    return { data, error }
  }, [])

  // ── Update habit ──────────────────────────────────────────────
  const updateHabit = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setHabits(prev => prev.map(h => h.id === id ? data : h))
    }
    return { data, error }
  }, [])

  // ── Delete habit ──────────────────────────────────────────────
  const deleteHabit = useCallback(async (id) => {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)

    if (!error) {
      setHabits(prev => prev.filter(h => h.id !== id))
    }
    return { error }
  }, [])

  // ── Streak calculation ────────────────────────────────────────
  const getStreak = useCallback((habitId) => {
    let streak = 0
    const cursor = new Date()

    // Check today first — if not done, start from yesterday
    const todayDone = (completions[toDateStr(cursor)] || []).includes(habitId)
    if (!todayDone) cursor.setDate(cursor.getDate() - 1)

    while (true) {
      const dateStr = toDateStr(cursor)
      if ((completions[dateStr] || []).includes(habitId)) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }, [completions])

  // ── Global streak (all habits completed) ─────────────────────
  const getGlobalStreak = useCallback(() => {
    if (habits.length === 0) return 0
    let streak = 0
    const cursor = new Date()
    const todayIds = completions[toDateStr(cursor)] || []
    const allTodayDone = habits.every(h => todayIds.includes(h.id))
    if (!allTodayDone) cursor.setDate(cursor.getDate() - 1)

    while (true) {
      const dateStr = toDateStr(cursor)
      const doneIds = completions[dateStr] || []
      const allDone = habits.every(h => doneIds.includes(h.id))
      if (allDone) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }, [completions, habits])

  // ── Day status for calendar ───────────────────────────────────
  const getDayStatus = useCallback((date) => {
    const dateStr = toDateStr(date)
    const doneIds = completions[dateStr] || []
    if (habits.length === 0) return 'empty'
    if (doneIds.length === 0) return 'none'
    if (habits.every(h => doneIds.includes(h.id))) return 'full'
    return 'partial'
  }, [completions, habits])

  return {
    habits,
    completions,
    loading,
    error,
    today,
    toDateStr,
    toggleCompletion,
    addHabit,
    updateHabit,
    deleteHabit,
    getStreak,
    getGlobalStreak,
    getDayStatus,
    refetch: () => { fetchHabits(); fetchCompletions() }
  }
}
