import { useState } from 'react'
import './index.css'
import { useHabits } from './hooks/useHabits'
import { useSchool } from './hooks/useSchool'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import HomeScreen from './pages/HomeScreen'
import CalendarScreen from './pages/CalendarScreen'
import HabitsScreen from './pages/HabitsScreen'
import SchoolScreen from './pages/SchoolScreen'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [toasts, setToasts] = useState([])

  const habitData = useHabits()
  const schoolData = useSchool()

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  const isLoading = habitData.loading || schoolData.loading
  const hasError = habitData.error || schoolData.error

  if (isLoading) {
    return (
      <>
        <div className="bg-glow" />
        <div className="loading-screen">
          <div className="spinner" />
          <p className="loading-text">Cargando tus datos...</p>
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <div className="bg-glow" />
        <div className="loading-screen">
          <span style={{ fontSize: 48 }}>⚠️</span>
          <p style={{ color: 'var(--red)', textAlign: 'center', padding: '0 24px' }}>
            Error conectando con Supabase.<br />
            Verifica tu configuración en <code>.env</code>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{habitData.error || schoolData.error}</p>
        </div>
      </>
    )
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            habits={habitData.habits}
            completions={habitData.completions}
            today={habitData.today}
            toggleCompletion={habitData.toggleCompletion}
            getStreak={habitData.getStreak}
            getGlobalStreak={habitData.getGlobalStreak}
          />
        )
      case 'calendar':
        return (
          <CalendarScreen
            getDayStatus={habitData.getDayStatus}
            getGlobalStreak={habitData.getGlobalStreak}
            completions={habitData.completions}
            habits={habitData.habits}
            toDateStr={habitData.toDateStr}
          />
        )
      case 'school':
        return (
          <SchoolScreen
            subjects={schoolData.subjects}
            addSubject={schoolData.addSubject}
            updateSubject={schoolData.updateSubject}
            deleteSubject={schoolData.deleteSubject}
            addUnit={schoolData.addUnit}
            deleteUnit={schoolData.deleteUnit}
            addGrade={schoolData.addGrade}
            updateGrade={schoolData.updateGrade}
            deleteGrade={schoolData.deleteGrade}
            getUnitsForSubject={schoolData.getUnitsForSubject}
            getGradesForUnit={schoolData.getGradesForUnit}
            getUnitAverage={schoolData.getUnitAverage}
            getSubjectAverage={schoolData.getSubjectAverage}
            getGlobalAverage={schoolData.getGlobalAverage}
            addToast={addToast}
          />
        )
      case 'habits':
        return (
          <HabitsScreen
            habits={habitData.habits}
            addHabit={async (...args) => {
              const { error } = await habitData.addHabit(...args)
              if (error) addToast('Error al crear hábito', 'error')
              else addToast('¡Hábito creado! 🎉')
            }}
            updateHabit={async (...args) => {
              const { error } = await habitData.updateHabit(...args)
              if (error) addToast('Error al actualizar', 'error')
              else addToast('Hábito actualizado ✅')
            }}
            deleteHabit={async (...args) => {
              const { error } = await habitData.deleteHabit(...args)
              if (error) addToast('Error al eliminar', 'error')
              else addToast('Hábito eliminado')
            }}
            getStreak={habitData.getStreak}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="bg-glow" />

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="app-layout">
        {renderPage()}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </>
  )
}
