-- =====================================================
-- MIGRACIÓN: Agregar tablas de Escolar
-- Ejecuta esto si ya tenías las tablas de hábitos
-- =====================================================

-- Materias
CREATE TABLE IF NOT EXISTS subjects (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  emoji      TEXT DEFAULT '📘',
  color      TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unidades
CREATE TABLE IF NOT EXISTS units (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  unit_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calificaciones
CREATE TABLE IF NOT EXISTS grades (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id    UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  type       TEXT NOT NULL DEFAULT 'activity' CHECK (type IN ('activity', 'exam')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_units_subject ON units(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_unit ON grades(unit_id);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for anon" ON subjects FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON units FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON grades FOR ALL TO anon USING (true) WITH CHECK (true);
