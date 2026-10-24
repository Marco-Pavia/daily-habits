-- =====================================================
-- SCHEMA para RoastMe — Hábitos Diarios
-- Ejecuta esto en el SQL Editor de Supabase
-- =====================================================

-- Tabla de hábitos
CREATE TABLE IF NOT EXISTS habits (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  emoji      TEXT DEFAULT '⭐',
  color      TEXT DEFAULT '#7c3aed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de completados (un registro por hábito por día)
CREATE TABLE IF NOT EXISTS completions (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id       UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(completed_date);
CREATE INDEX IF NOT EXISTS idx_completions_habit ON completions(habit_id);

-- Habilitar RLS (Row Level Security) — acceso total sin autenticación
-- Ya que la app es de uso personal sin login
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (anon key puede leer y escribir)
CREATE POLICY "Allow all for anon" ON habits FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON completions FOR ALL TO anon USING (true) WITH CHECK (true);

-- Datos de ejemplo (opcional, puedes borrar esto)
-- INSERT INTO habits (name, emoji, color) VALUES
--   ('Ejercicio', '💪', '#7c3aed'),
--   ('Leer', '📚', '#3b82f6'),
--   ('Meditar', '🧘', '#10b981'),
--   ('Agua 2L', '💧', '#06b6d4');
