-- =====================================================
-- SCHEMA para RoastMe — Hábitos Diarios + Escolar
-- Ejecuta esto en el SQL Editor de Supabase
-- =====================================================

-- ─── HÁBITOS ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS habits (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  emoji      TEXT DEFAULT '⭐',
  color      TEXT DEFAULT '#7c3aed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS completions (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id       UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(completed_date);
CREATE INDEX IF NOT EXISTS idx_completions_habit ON completions(habit_id);

-- ─── ESCOLAR ────────────────────────────────────────

-- Materias con criterios de evaluación ponderados
-- criteria es JSONB: [{"name":"Act. Clase","weight":30}, {"name":"Tareas","weight":30}, {"name":"Examen","weight":40}]
CREATE TABLE IF NOT EXISTS subjects (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  emoji      TEXT DEFAULT '📘',
  color      TEXT DEFAULT '#3b82f6',
  criteria   JSONB DEFAULT '[{"name":"Actividades","weight":50},{"name":"Examen","weight":50}]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unidades (pertenecen a una materia)
CREATE TABLE IF NOT EXISTS units (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  unit_number INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Calificaciones (pertenecen a una unidad)
-- category: nombre del criterio al que pertenece (ej: "Act. Clase", "Tareas", "Examen")
CREATE TABLE IF NOT EXISTS grades (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id    UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  category   TEXT NOT NULL DEFAULT 'Actividades',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_units_subject ON units(subject_id);
CREATE INDEX IF NOT EXISTS idx_grades_unit ON grades(unit_id);

-- ─── RLS ────────────────────────────────────────────

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='habits' AND policyname='Allow all for anon') THEN
    CREATE POLICY "Allow all for anon" ON habits FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='completions' AND policyname='Allow all for anon') THEN
    CREATE POLICY "Allow all for anon" ON completions FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='subjects' AND policyname='Allow all for anon') THEN
    CREATE POLICY "Allow all for anon" ON subjects FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='units' AND policyname='Allow all for anon') THEN
    CREATE POLICY "Allow all for anon" ON units FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='grades' AND policyname='Allow all for anon') THEN
    CREATE POLICY "Allow all for anon" ON grades FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;
