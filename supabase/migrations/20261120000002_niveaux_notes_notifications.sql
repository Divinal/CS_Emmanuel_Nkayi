-- 2/3 — Cycles et niveaux, annonces, suivi quotidien, notifications, notes par trimestre
-- Base neuve : exécuter les 3 fichiers dans l'ordre (1, 2, 3), un par un,
-- dans Supabase > SQL Editor, ou d'un coup avec « npx supabase db push ».

-- =====================================================================
-- Origine : 20261106120000_cycles_and_levels.sql
-- =====================================================================

-- ============================================================
-- CYCLES & NIVEAUX : remplace la notion de "classe".
--
-- Un étudiant est désormais inscrit directement dans un niveau, lui-même
-- rattaché à un cycle (Garderie, Pré-scolaire, Primaire, Collège, Lycée, Supérieur).
--
-- Cette migration ne supprime aucune donnée : les tables classes,
-- teacher_classes, subject_classes et courses, ainsi que les colonnes
-- class_id, restent en place mais ne sont plus utilisées par l'application.
-- ============================================================

CREATE TYPE public.school_cycle AS ENUM ('garderie', 'prescolaire', 'primaire', 'college', 'lycee', 'superieur');

CREATE TABLE public.levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle public.school_cycle NOT NULL,
  name TEXT NOT NULL UNIQUE,
  position SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_levels_cycle ON public.levels(cycle, position);

INSERT INTO public.levels (cycle, name, position) VALUES
  ('garderie', 'Garderie', 1),
  ('prescolaire', 'Petite Section', 1),
  ('prescolaire', 'Moyenne Section', 2),
  ('prescolaire', 'Grande Section', 3),
  ('primaire', 'CP1', 1),
  ('primaire', 'CP2', 2),
  ('primaire', 'CE1', 3),
  ('primaire', 'CE2', 4),
  ('primaire', 'CM1', 5),
  ('primaire', 'CM2', 6),
  ('college', '6ème', 1),
  ('college', '5ème', 2),
  ('college', '4ème', 3),
  ('college', '3ème', 4),
  ('lycee', 'Seconde', 1),
  ('lycee', 'Première', 2),
  ('lycee', 'Terminale', 3),
  ('superieur', 'Technicien', 1),
  ('superieur', 'Technicien Supérieur 1', 2),
  ('superieur', 'Technicien Supérieur 2', 3),
  ('superieur', 'Bachelor', 4),
  ('superieur', 'Master 1', 5),
  ('superieur', 'Master 2', 6);

-- ---------- Rattachement des données au niveau ----------
-- RESTRICT sur students : un niveau qui a encore des inscrits ne peut pas
-- être supprimé. SET NULL sur grades : une note survit à son niveau.
ALTER TABLE public.students
  ADD COLUMN level_id UUID REFERENCES public.levels(id) ON DELETE RESTRICT;
CREATE INDEX idx_students_level ON public.students(level_id);

ALTER TABLE public.grades
  ADD COLUMN level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL;
CREATE INDEX idx_grades_level ON public.grades(level_id);

ALTER TABLE public.schedules
  ADD COLUMN level_id UUID REFERENCES public.levels(id) ON DELETE CASCADE;
CREATE INDEX idx_schedules_level ON public.schedules(level_id);

-- Les nouvelles notes et les nouveaux créneaux n'ont plus de classe.
ALTER TABLE public.grades ALTER COLUMN class_id DROP NOT NULL;
ALTER TABLE public.schedules ALTER COLUMN class_id DROP NOT NULL;

-- Ces clés supprimaient en cascade notes et créneaux avec leur classe :
-- on les neutralise pour qu'un futur nettoyage de "classes" ne les efface pas.
ALTER TABLE public.grades DROP CONSTRAINT IF EXISTS grades_class_id_fkey;
ALTER TABLE public.grades
  ADD CONSTRAINT grades_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;

ALTER TABLE public.schedules DROP CONSTRAINT IF EXISTS schedules_class_id_fkey;
ALTER TABLE public.schedules
  ADD CONSTRAINT schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;

-- ---------- Tables de liaison par niveau ----------
CREATE TABLE public.teacher_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  UNIQUE (teacher_id, level_id, subject_id)
);
CREATE INDEX idx_teacher_levels_level ON public.teacher_levels(level_id);

CREATE TABLE public.subject_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES public.levels(id) ON DELETE CASCADE,
  UNIQUE (subject_id, level_id)
);
CREATE INDEX idx_subject_levels_level ON public.subject_levels(level_id);

-- ---------- Téléphone enseignant ----------
-- Jusqu'ici saisi à la création mais conservé seulement dans les métadonnées
-- du compte : il est nécessaire sur la fiche enseignant.
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS phone TEXT;
UPDATE public.teachers t
SET phone = u.raw_user_meta_data->>'phone'
FROM auth.users u
WHERE u.id = t.user_id AND t.phone IS NULL;

-- ============================================================
-- REPRISE DES DONNÉES EXISTANTES
-- Chaque classe est rattachée à un niveau quand la correspondance est sûre.
-- Sinon elle reste sans niveau : ses étudiants apparaissent dans
-- "À inscrire" et l'école les place à la main. Rien n'est deviné.
-- ============================================================
ALTER TABLE public.classes
  ADD COLUMN level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL;

WITH mapping AS (
  SELECT c.id,
    CASE
      -- 1. Valeurs exactes de l'ancien sélecteur "Niveau"
      WHEN c.level ILIKE 'Technicien' THEN 'Technicien'
      WHEN c.level ILIKE 'TS1' THEN 'Technicien Supérieur 1'
      WHEN c.level ILIKE 'TS2' THEN 'Technicien Supérieur 2'
      WHEN c.level ILIKE 'Bachelor' THEN 'Bachelor'
      WHEN c.level ILIKE 'Master 1' THEN 'Master 1'
      WHEN c.level ILIKE 'Master 2' THEN 'Master 2'
      -- 2. Nom de la classe, pour les anciens niveaux trop larges
      WHEN c.name ~* '(petite\s+section|^PS\y)' THEN 'Petite Section'
      WHEN c.name ~* '(moyenne\s+section|^MS\y)' THEN 'Moyenne Section'
      WHEN c.name ~* '(grande\s+section|^GS\y)' THEN 'Grande Section'
      WHEN c.name ~* '\yCP\s*1\y' THEN 'CP1'
      WHEN c.name ~* '\yCP\s*2\y' THEN 'CP2'
      WHEN c.name ~* '\yCE\s*1\y' THEN 'CE1'
      WHEN c.name ~* '\yCE\s*2\y' THEN 'CE2'
      WHEN c.name ~* '\yCM\s*1\y' THEN 'CM1'
      WHEN c.name ~* '\yCM\s*2\y' THEN 'CM2'
      -- Un chiffre seul n'a de sens que dans un ancien niveau "Collège"
      -- (sinon "3" dans "Licence 3" serait pris pour la 3ème).
      WHEN c.level ILIKE 'Coll%' AND c.name ~ '^\s*6' THEN '6ème'
      WHEN c.level ILIKE 'Coll%' AND c.name ~ '^\s*5' THEN '5ème'
      WHEN c.level ILIKE 'Coll%' AND c.name ~ '^\s*4' THEN '4ème'
      WHEN c.level ILIKE 'Coll%' AND c.name ~ '^\s*3' THEN '3ème'
      WHEN c.level ILIKE 'Lyc%' AND c.name ~* '(seconde|^\s*2\s*n?de)' THEN 'Seconde'
      WHEN c.level ILIKE 'Lyc%' AND c.name ~* '(premi[eè]re|^\s*1\s*[eè]re)' THEN 'Première'
      WHEN c.level ILIKE 'Lyc%' AND c.name ~* '(terminale|^\s*tle\y)' THEN 'Terminale'
    END AS level_name
  FROM public.classes c
)
UPDATE public.classes c
SET level_id = l.id
FROM mapping m
JOIN public.levels l ON l.name = m.level_name
WHERE c.id = m.id;

UPDATE public.students s SET level_id = c.level_id
FROM public.classes c WHERE s.class_id = c.id AND c.level_id IS NOT NULL;

UPDATE public.grades g SET level_id = c.level_id
FROM public.classes c WHERE g.class_id = c.id AND c.level_id IS NOT NULL;

UPDATE public.schedules sc SET level_id = c.level_id
FROM public.classes c WHERE sc.class_id = c.id AND c.level_id IS NOT NULL;

INSERT INTO public.teacher_levels (teacher_id, level_id, subject_id)
SELECT tc.teacher_id, c.level_id, tc.subject_id
FROM public.teacher_classes tc
JOIN public.classes c ON c.id = tc.class_id
WHERE c.level_id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.subject_levels (subject_id, level_id)
SELECT sc.subject_id, c.level_id
FROM public.subject_classes sc
JOIN public.classes c ON c.id = sc.class_id
WHERE c.level_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view levels" ON public.levels
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage levels" ON public.levels
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Academic admins can manage levels" ON public.levels
FOR ALL USING (public.has_role(auth.uid(), 'academic_admin'));

CREATE POLICY "Everyone can view teacher levels" ON public.teacher_levels
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage teacher levels" ON public.teacher_levels
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Academic admins can manage teacher levels" ON public.teacher_levels
FOR ALL USING (public.has_role(auth.uid(), 'academic_admin'));

CREATE POLICY "Secretaries can manage teacher levels" ON public.teacher_levels
FOR ALL USING (public.has_role(auth.uid(), 'admin_secretaire'));

CREATE POLICY "Everyone can view subject levels" ON public.subject_levels
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage subject levels" ON public.subject_levels
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Academic admins can manage subject levels" ON public.subject_levels
FOR ALL USING (public.has_role(auth.uid(), 'academic_admin'));

CREATE POLICY "Secretaries can manage subject levels" ON public.subject_levels
FOR ALL USING (public.has_role(auth.uid(), 'admin_secretaire'));

-- Un enseignant voit les étudiants des niveaux où il intervient. L'ancienne
-- policy par classe est retirée : teacher_classes n'est plus mis à jour, elle
-- laisserait un enseignant retiré d'un niveau voir ses anciens étudiants.
DROP POLICY IF EXISTS "Teachers can view students in their classes" ON public.students;

CREATE POLICY "Teachers can view students in their levels" ON public.students
FOR SELECT USING (
  public.has_role(auth.uid(), 'teacher') AND
  level_id IN (
    SELECT tl.level_id FROM public.teacher_levels tl
    JOIN public.teachers t ON t.id = tl.teacher_id
    WHERE t.user_id = auth.uid()
  )
);

-- =====================================================================
-- Origine : 20261106130000_announcements.sql
-- =====================================================================

-- La table announcements est utilisée par l'application mais n'avait jamais été
-- créée : l'onglet Annonces échouait en production. Sans risque si elle existe.
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('students', 'teachers', 'all')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(published_at DESC);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can read all announcements" ON public.announcements;
CREATE POLICY "Staff can read all announcements" ON public.announcements
FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'academic_admin')
  OR public.has_role(auth.uid(), 'finance_admin')
  OR public.has_role(auth.uid(), 'admin_secretaire')
);

DROP POLICY IF EXISTS "Audience can read its announcements" ON public.announcements;
CREATE POLICY "Audience can read its announcements" ON public.announcements
FOR SELECT TO authenticated USING (
  target_audience = 'all'
  OR (target_audience = 'students' AND public.has_role(auth.uid(), 'student'))
  OR (target_audience = 'teachers' AND public.has_role(auth.uid(), 'teacher'))
);

DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements" ON public.announcements
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'academic_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'academic_admin'));

-- =====================================================================
-- Origine : 20261106140000_student_daily_reports.sql
-- =====================================================================

-- Suivi administratif : un rapport par étudiant, par jour et par auteur, pour que
-- plusieurs enseignants puissent écrire sur le même étudiant sans s'écraser.
CREATE TABLE IF NOT EXISTS public.student_daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  level_id UUID REFERENCES public.levels(id) ON DELETE SET NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  attendance TEXT CHECK (attendance IN ('present', 'absent', 'late', 'excused')),
  conduct TEXT CHECK (conduct IN ('excellent', 'good', 'fair', 'concern')),
  activities TEXT,
  observations TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT student_daily_reports_one_per_author UNIQUE (student_id, report_date, author_id),
  CONSTRAINT student_daily_reports_not_empty CHECK (
    attendance IS NOT NULL OR conduct IS NOT NULL OR activities IS NOT NULL OR observations IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_student_daily_reports_date ON public.student_daily_reports(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_student_daily_reports_student ON public.student_daily_reports(student_id, report_date DESC);

DROP TRIGGER IF EXISTS update_student_daily_reports_updated_at ON public.student_daily_reports;
CREATE TRIGGER update_student_daily_reports_updated_at
BEFORE UPDATE ON public.student_daily_reports
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.student_daily_reports ENABLE ROW LEVEL SECURITY;

-- Lecture : l'administration voit tout, un enseignant ses propres rapports.
-- Les étudiants n'y ont pas accès : c'est un suivi interne.
DROP POLICY IF EXISTS "Staff and authors can read daily reports" ON public.student_daily_reports;
CREATE POLICY "Staff and authors can read daily reports" ON public.student_daily_reports
FOR SELECT TO authenticated USING (
  author_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'academic_admin')
  OR public.has_role(auth.uid(), 'admin_secretaire')
);

-- Écriture : toujours en son propre nom ; un enseignant seulement sur les niveaux qui lui sont affectés.
DROP POLICY IF EXISTS "Staff and teachers can write daily reports" ON public.student_daily_reports;
CREATE POLICY "Staff and teachers can write daily reports" ON public.student_daily_reports
FOR INSERT TO authenticated WITH CHECK (
  author_id = auth.uid()
  AND (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'academic_admin')
    OR public.has_role(auth.uid(), 'admin_secretaire')
    OR EXISTS (
      SELECT 1
      FROM public.teachers t
      JOIN public.teacher_levels tl ON tl.teacher_id = t.id
      JOIN public.students s ON s.level_id = tl.level_id
      WHERE t.user_id = auth.uid() AND s.id = student_id
    )
  )
);

DROP POLICY IF EXISTS "Authors can update their daily reports" ON public.student_daily_reports;
CREATE POLICY "Authors can update their daily reports" ON public.student_daily_reports
FOR UPDATE TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "Authors and admins can delete daily reports" ON public.student_daily_reports;
CREATE POLICY "Authors and admins can delete daily reports" ON public.student_daily_reports
FOR DELETE TO authenticated USING (
  author_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'academic_admin')
);

-- =====================================================================
-- Origine : 20261106150000_notifications.sql
-- =====================================================================

-- Cloche de notifications : les lignes sont créées uniquement par les déclencheurs
-- ci-dessous, jamais par le navigateur. Une personne ne peut donc ni en inventer
-- ni en envoyer à quelqu'un d'autre.
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'payment', 'payslip', 'grade', 'exam', 'announcement', 'schedule', 'followup')),
  title TEXT NOT NULL,
  body TEXT,
  link_tab TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_date ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id) WHERE NOT is_read;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read their notifications" ON public.notifications;
CREATE POLICY "Users read their notifications" ON public.notifications
FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users mark their notifications" ON public.notifications;
CREATE POLICY "Users mark their notifications" ON public.notifications
FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Seul le statut "lu" est modifiable depuis le navigateur.
REVOKE ALL ON public.notifications FROM anon, authenticated;
GRANT SELECT ON public.notifications TO authenticated;
GRANT UPDATE (is_read) ON public.notifications TO authenticated;

-- Temps réel : la cloche se met à jour sans recharger la page.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime')
     AND NOT EXISTS (
       SELECT 1 FROM pg_publication_tables
       WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
     ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- ---------- Outils internes ----------
-- _dedupe : n'ajoute rien si la personne a déjà la même notification non lue,
-- pour qu'un emploi du temps saisi en 30 créneaux ne fasse pas 30 alertes.
-- La personne à l'origine de l'action n'est pas notifiée.
CREATE OR REPLACE FUNCTION public.notify_users(
  _user_ids UUID[], _type TEXT, _title TEXT, _body TEXT, _link_tab TEXT, _dedupe BOOLEAN DEFAULT false
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, body, link_tab)
  SELECT DISTINCT target, _type, _title, _body, _link_tab
  FROM unnest(_user_ids) AS target
  WHERE target IS NOT NULL
    AND target IS DISTINCT FROM auth.uid()
    AND (NOT _dedupe OR NOT EXISTS (
      SELECT 1 FROM public.notifications existing
      WHERE existing.user_id = target AND existing.type = _type
        AND existing.body IS NOT DISTINCT FROM _body AND NOT existing.is_read
    ));
END $$;

CREATE OR REPLACE FUNCTION public.notification_staff(_roles TEXT[]) RETURNS UUID[]
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(array_agg(user_id), '{}') FROM public.user_roles WHERE role::text = ANY(_roles);
$$;

CREATE OR REPLACE FUNCTION public.notification_fcfa(_amount NUMERIC) RETURNS TEXT
LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT replace(to_char(_amount, 'FM999,999,999,990'), ',', ' ') || ' FCFA';
$$;

CREATE OR REPLACE FUNCTION public.notification_student(_student_id UUID, OUT user_id UUID, OUT full_name TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.user_id, trim(COALESCE(p.first_name, '') || ' ' || COALESCE(p.last_name, ''))
  FROM public.students s LEFT JOIN public.profiles p ON p.user_id = s.user_id
  WHERE s.id = _student_id;
$$;

-- Aucune de ces fonctions ne doit être appelable depuis l'API.
REVOKE ALL ON FUNCTION public.notify_users(UUID[], TEXT, TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notification_staff(TEXT[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.notification_student(UUID) FROM PUBLIC, anon, authenticated;

-- ---------- Messages ----------
CREATE OR REPLACE FUNCTION public.notify_on_message() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _targets UUID[];
BEGIN
  _targets := CASE NEW.recipient_type
    WHEN 'individual' THEN ARRAY[NEW.recipient_id]
    WHEN 'all_students' THEN public.notification_staff(ARRAY['student'])
    WHEN 'all_teachers' THEN public.notification_staff(ARRAY['teacher'])
    WHEN 'all' THEN public.notification_staff(ARRAY['student', 'teacher'])
    ELSE '{}'::UUID[]
  END;
  PERFORM public.notify_users(_targets, 'message', 'Nouveau message', NEW.subject, 'messages');
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification message : %', SQLERRM;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS notify_on_message ON public.messages;
CREATE TRIGGER notify_on_message AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.notify_on_message();

-- ---------- Paiements de scolarité ----------
CREATE OR REPLACE FUNCTION public.notify_on_tuition_payment() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _title TEXT;
  _student RECORD;
  _detail TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    _title := 'Paiement enregistré';
  ELSIF NEW.voided_at IS NOT NULL AND OLD.voided_at IS NULL THEN
    _title := 'Paiement annulé';
  ELSIF NEW.amount IS DISTINCT FROM OLD.amount THEN
    _title := 'Paiement modifié';
  ELSE
    RETURN NULL;
  END IF;

  SELECT * INTO _student FROM public.notification_student(NEW.student_id);
  _detail := public.notification_fcfa(NEW.amount) || ' — reçu ' || NEW.receipt_number;

  PERFORM public.notify_users(ARRAY[_student.user_id], 'payment', _title, _detail, 'payments');
  PERFORM public.notify_users(
    public.notification_staff(ARRAY['admin', 'finance_admin']), 'payment', _title,
    _student.full_name || ' : ' || _detail, 'finance'
  );
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification paiement : %', SQLERRM;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS notify_on_tuition_payment ON public.tuition_fee_payments;
CREATE TRIGGER notify_on_tuition_payment AFTER INSERT OR UPDATE ON public.tuition_fee_payments
FOR EACH ROW EXECUTE FUNCTION public.notify_on_tuition_payment();

-- ---------- Bulletins de paie ----------
CREATE OR REPLACE FUNCTION public.notify_on_payslip() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _title TEXT;
  _teacher_user UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    _title := 'Bulletin de paie disponible';
  ELSIF NEW.voided_at IS NOT NULL AND OLD.voided_at IS NULL THEN
    _title := 'Bulletin de paie annulé';
  ELSIF NEW.gross_amount IS DISTINCT FROM OLD.gross_amount THEN
    _title := 'Bulletin de paie modifié';
  ELSE
    RETURN NULL;
  END IF;

  SELECT user_id INTO _teacher_user FROM public.teachers WHERE id = NEW.teacher_id;
  PERFORM public.notify_users(
    ARRAY[_teacher_user], 'payslip', _title,
    public.notification_fcfa(NEW.gross_amount) || ' — ' || NEW.payslip_number, 'payslips'
  );
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification paie : %', SQLERRM;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS notify_on_payslip ON public.teacher_payslips;
CREATE TRIGGER notify_on_payslip AFTER INSERT OR UPDATE ON public.teacher_payslips
FOR EACH ROW EXECUTE FUNCTION public.notify_on_payslip();

-- ---------- Notes et examens ----------
CREATE OR REPLACE FUNCTION public.notify_on_grade() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _student RECORD;
  _subject TEXT;
  _is_exam BOOLEAN;
  _title TEXT;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.grade_value IS NOT DISTINCT FROM OLD.grade_value THEN
    RETURN NULL;
  END IF;

  SELECT * INTO _student FROM public.notification_student(NEW.student_id);
  SELECT name INTO _subject FROM public.subjects WHERE id = NEW.subject_id;
  _is_exam := NEW.grade_type ILIKE 'E.%' OR NEW.grade_type ILIKE 'exam%';
  _title := CASE
    WHEN TG_OP = 'UPDATE' THEN 'Note modifiée'
    WHEN _is_exam THEN 'Résultat d''examen'
    ELSE 'Nouvelle note'
  END;

  PERFORM public.notify_users(
    ARRAY[_student.user_id], CASE WHEN _is_exam THEN 'exam' ELSE 'grade' END, _title,
    COALESCE(_subject, 'Matière') || ' — ' || NEW.grade_type || ' : '
      || rtrim(rtrim(to_char(NEW.grade_value, 'FM990.00'), '0'), '.') || '/20',
    'grades'
  );
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification note : %', SQLERRM;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS notify_on_grade ON public.grades;
CREATE TRIGGER notify_on_grade AFTER INSERT OR UPDATE OF grade_value ON public.grades
FOR EACH ROW EXECUTE FUNCTION public.notify_on_grade();

-- ---------- Annonces ----------
CREATE OR REPLACE FUNCTION public.notify_on_announcement() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _roles TEXT[];
BEGIN
  _roles := CASE NEW.target_audience
    WHEN 'students' THEN ARRAY['student']
    WHEN 'teachers' THEN ARRAY['teacher']
    ELSE ARRAY['student', 'teacher']
  END;
  PERFORM public.notify_users(
    public.notification_staff(_roles), 'announcement',
    CASE WHEN NEW.priority = 'urgent' THEN 'Annonce urgente' ELSE 'Nouvelle annonce' END,
    NEW.title, 'announcements'
  );
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification annonce : %', SQLERRM;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS notify_on_announcement ON public.announcements;
CREATE TRIGGER notify_on_announcement AFTER INSERT ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.notify_on_announcement();

-- ---------- Emplois du temps ----------
CREATE OR REPLACE FUNCTION public.notify_on_schedule() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _level_ids UUID[];
  _teacher_ids UUID[];
  _targets UUID[];
BEGIN
  _level_ids := CASE TG_OP
    WHEN 'INSERT' THEN ARRAY[NEW.level_id]
    WHEN 'DELETE' THEN ARRAY[OLD.level_id]
    ELSE ARRAY[NEW.level_id, OLD.level_id]
  END;
  _teacher_ids := CASE TG_OP
    WHEN 'INSERT' THEN ARRAY[NEW.teacher_id]
    WHEN 'DELETE' THEN ARRAY[OLD.teacher_id]
    ELSE ARRAY[NEW.teacher_id, OLD.teacher_id]
  END;

  SELECT array_agg(user_id) INTO _targets FROM (
    SELECT user_id FROM public.students WHERE level_id = ANY(_level_ids)
    UNION
    SELECT user_id FROM public.teachers WHERE id = ANY(_teacher_ids)
  ) AS concerned;

  PERFORM public.notify_users(
    COALESCE(_targets, '{}'), 'schedule', 'Emploi du temps modifié',
    'Consultez votre emploi du temps à jour.', 'schedule', true
  );
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification emploi du temps : %', SQLERRM;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS notify_on_schedule ON public.schedules;
CREATE TRIGGER notify_on_schedule AFTER INSERT OR UPDATE OR DELETE ON public.schedules
FOR EACH ROW EXECUTE FUNCTION public.notify_on_schedule();

-- ---------- Suivi des étudiants (comportement, absences) ----------
-- L'étudiant lit ses propres rapports : cela permet aux parents de suivre.
DROP POLICY IF EXISTS "Students read their daily reports" ON public.student_daily_reports;
CREATE POLICY "Students read their daily reports" ON public.student_daily_reports
FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Administration et étudiant sont prévenus.
-- Absence, retard et conduite à surveiller : une alerte à chaque fois.
-- Le reste du suivi : une seule alerte non lue (par niveau et par jour pour
-- l'administration, par jour pour l'étudiant). "Présent" seul n'alerte personne.
CREATE OR REPLACE FUNCTION public.notify_on_daily_report() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _student RECORD;
  _level TEXT;
  _staff UUID[];
  _day TEXT;
  _label TEXT;
  _previous_attendance TEXT;
  _previous_conduct TEXT;
  _previous_observations TEXT;
  _previous_activities TEXT;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    _previous_attendance := OLD.attendance;
    _previous_conduct := OLD.conduct;
    _previous_observations := OLD.observations;
    _previous_activities := OLD.activities;
  END IF;

  SELECT * INTO _student FROM public.notification_student(NEW.student_id);
  SELECT name INTO _level FROM public.levels WHERE id = NEW.level_id;
  _staff := public.notification_staff(ARRAY['admin', 'academic_admin', 'admin_secretaire']);
  _day := to_char(NEW.report_date, 'DD/MM/YYYY');
  _label := _student.full_name || ' (' || COALESCE(_level, 'sans niveau') || ') — ' || _day;

  IF NEW.attendance IS DISTINCT FROM _previous_attendance AND NEW.attendance IN ('absent', 'late') THEN
    PERFORM public.notify_users(
      _staff, 'followup', CASE NEW.attendance WHEN 'absent' THEN 'Absence signalée' ELSE 'Retard signalé' END,
      _label, 'followup'
    );
    PERFORM public.notify_users(
      ARRAY[_student.user_id], 'followup',
      CASE NEW.attendance WHEN 'absent' THEN 'Absence enregistrée' ELSE 'Retard enregistré' END,
      _day, 'followup'
    );
  END IF;

  IF NEW.conduct IS DISTINCT FROM _previous_conduct AND NEW.conduct = 'concern' THEN
    PERFORM public.notify_users(_staff, 'followup', 'Comportement à surveiller', _label, 'followup');
    PERFORM public.notify_users(ARRAY[_student.user_id], 'followup', 'Comportement à surveiller', _day, 'followup');
  ELSE
    IF (NEW.conduct IS DISTINCT FROM _previous_conduct AND NEW.conduct IS NOT NULL)
       OR (NEW.observations IS DISTINCT FROM _previous_observations AND NEW.observations IS NOT NULL) THEN
      PERFORM public.notify_users(
        _staff, 'followup', 'Suivi des comportements mis à jour',
        COALESCE(_level, 'Sans niveau') || ' — ' || _day, 'followup', true
      );
    END IF;
    IF (NEW.conduct IS DISTINCT FROM _previous_conduct AND NEW.conduct IS NOT NULL)
       OR (NEW.observations IS DISTINCT FROM _previous_observations AND NEW.observations IS NOT NULL)
       OR (NEW.activities IS DISTINCT FROM _previous_activities AND NEW.activities IS NOT NULL) THEN
      PERFORM public.notify_users(ARRAY[_student.user_id], 'followup', 'Nouveau rapport de suivi', _day, 'followup', true);
    END IF;
  END IF;
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification suivi : %', SQLERRM;
  RETURN NULL;
END $$;

DROP TRIGGER IF EXISTS notify_on_daily_report ON public.student_daily_reports;
CREATE TRIGGER notify_on_daily_report AFTER INSERT OR UPDATE ON public.student_daily_reports
FOR EACH ROW EXECUTE FUNCTION public.notify_on_daily_report();

-- =====================================================================
-- Origine : 20261112120000_grade_terms.sql
-- =====================================================================

-- Trimestres et types d'évaluation selon le cycle.
--   Pré-scolaire et primaire : uniquement des compositions, une par trimestre.
--   Collège et lycée : devoirs (nombre libre), devoir départemental et composition, par trimestre.
--   Supérieur : CC1, CC2, CC3, examen théorique et examen pratique, sans trimestre.
-- Le bulletin trimestriel se calcule à partir de term et academic_year.
-- Les notes déjà saisies ne sont pas modifiées : le contrôle ne porte que sur
-- les nouvelles notes et sur un changement de type, de trimestre ou de niveau.

ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS term SMALLINT;
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS academic_year TEXT;

DO $$ BEGIN
  ALTER TABLE public.grades ADD CONSTRAINT grades_term_range CHECK (term BETWEEN 1 AND 3);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_grades_year_term ON public.grades(academic_year, term);

-- Une seule composition et un seul devoir départemental par élève, matière et trimestre.
CREATE UNIQUE INDEX IF NOT EXISTS grades_one_per_term
  ON public.grades(student_id, subject_id, academic_year, term, grade_type)
  WHERE grade_type IN ('Composition', 'Devoir départemental') AND term IS NOT NULL;

CREATE OR REPLACE FUNCTION public.check_grade_scheme() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _level UUID;
  _cycle TEXT;
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW.grade_type IS NOT DISTINCT FROM OLD.grade_type
     AND NEW.term IS NOT DISTINCT FROM OLD.term
     AND NEW.level_id IS NOT DISTINCT FROM OLD.level_id
     AND NEW.subject_id IS NOT DISTINCT FROM OLD.subject_id THEN
    RETURN NEW;
  END IF;

  _level := COALESCE(NEW.level_id, (SELECT level_id FROM public.students WHERE id = NEW.student_id));
  SELECT cycle INTO _cycle FROM public.levels WHERE id = _level;

  -- Un enseignant ne note que dans les niveaux et les matières qui lui sont affectés.
  IF public.has_role(auth.uid(), 'teacher')
     AND NOT public.has_role(auth.uid(), 'admin')
     AND NOT public.has_role(auth.uid(), 'academic_admin')
     AND NOT EXISTS (
       SELECT 1 FROM public.teacher_levels tl
       JOIN public.teachers t ON t.id = tl.teacher_id
       WHERE t.user_id = auth.uid() AND tl.level_id = _level AND tl.subject_id = NEW.subject_id
     ) THEN
    RAISE EXCEPTION 'Vous n''êtes pas affecté à ce niveau pour cette matière.' USING ERRCODE = '42501';
  END IF;

  IF _cycle IN ('garderie', 'prescolaire', 'primaire') AND NEW.grade_type <> 'Composition' THEN
    RAISE EXCEPTION 'Au pré-scolaire et au primaire, seules les compositions sont notées.' USING ERRCODE = '23514';
  ELSIF _cycle IN ('college', 'lycee') AND NEW.grade_type NOT IN ('Devoir', 'Devoir départemental', 'Composition') THEN
    RAISE EXCEPTION 'Au collège et au lycée, les notes sont des devoirs, devoirs départementaux ou compositions.' USING ERRCODE = '23514';
  ELSIF _cycle = 'superieur' AND NEW.grade_type NOT IN ('CC1', 'CC2', 'CC3', 'E.Théorique', 'E.Pratique') THEN
    RAISE EXCEPTION 'Au supérieur, les notes sont des contrôles continus ou des examens.' USING ERRCODE = '23514';
  END IF;

  IF _cycle IN ('garderie', 'prescolaire', 'primaire', 'college', 'lycee') AND NEW.term IS NULL THEN
    RAISE EXCEPTION 'Précisez le trimestre de la note.' USING ERRCODE = '23514';
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS check_grade_scheme ON public.grades;
CREATE TRIGGER check_grade_scheme BEFORE INSERT OR UPDATE ON public.grades
FOR EACH ROW EXECUTE FUNCTION public.check_grade_scheme();

-- Notification : compositions et devoirs départementaux comptent comme examens ; le trimestre est indiqué.
CREATE OR REPLACE FUNCTION public.notify_on_grade() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _student RECORD;
  _subject TEXT;
  _is_exam BOOLEAN;
  _title TEXT;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.grade_value IS NOT DISTINCT FROM OLD.grade_value THEN
    RETURN NULL;
  END IF;

  SELECT * INTO _student FROM public.notification_student(NEW.student_id);
  SELECT name INTO _subject FROM public.subjects WHERE id = NEW.subject_id;
  _is_exam := NEW.grade_type ILIKE 'E.%' OR NEW.grade_type ILIKE 'exam%'
    OR NEW.grade_type IN ('Composition', 'Devoir départemental');
  _title := CASE
    WHEN TG_OP = 'UPDATE' THEN 'Note modifiée'
    WHEN _is_exam THEN 'Résultat d''examen'
    ELSE 'Nouvelle note'
  END;

  PERFORM public.notify_users(
    ARRAY[_student.user_id], CASE WHEN _is_exam THEN 'exam' ELSE 'grade' END, _title,
    COALESCE(_subject, 'Matière') || ' — ' || NEW.grade_type
      || CASE WHEN NEW.term IS NOT NULL THEN ' (T' || NEW.term || ')' ELSE '' END
      || ' : ' || rtrim(rtrim(to_char(NEW.grade_value, 'FM990.00'), '0'), '.') || '/20',
    'grades'
  );
  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notification note : %', SQLERRM;
  RETURN NULL;
END $$;
