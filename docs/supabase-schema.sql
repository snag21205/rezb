-- =============================================
-- CV & Interview Coach — Supabase SQL Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  daily_ai_usage INTEGER DEFAULT 0,
  last_usage_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resumes
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  raw_text TEXT NOT NULL DEFAULT '',
  parsed_sections JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Resume Analyses
CREATE TABLE IF NOT EXISTS public.resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  section_scores JSONB NOT NULL DEFAULT '{}',
  strengths JSONB NOT NULL DEFAULT '[]',
  weaknesses JSONB NOT NULL DEFAULT '[]',
  suggestions JSONB NOT NULL DEFAULT '[]',
  ats_score INTEGER CHECK (ats_score BETWEEN 0 AND 100),
  ats_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Job Descriptions
CREATE TABLE IF NOT EXISTS public.job_descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT,
  raw_text TEXT NOT NULL,
  extracted_requirements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. JD Matches
CREATE TABLE IF NOT EXISTS public.jd_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  jd_id UUID NOT NULL REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score BETWEEN 0 AND 100),
  matched_skills JSONB NOT NULL DEFAULT '[]',
  missing_skills JSONB NOT NULL DEFAULT '[]',
  rewrite_suggestions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Interview Sessions
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  jd_id UUID NOT NULL REFERENCES public.job_descriptions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('technical', 'behavioral', 'mixed')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  total_score INTEGER,
  ai_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 7. Interview Q&A
CREATE TABLE IF NOT EXISTS public.interview_qa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('technical', 'behavioral', 'situational')),
  user_answer TEXT,
  score INTEGER CHECK (score BETWEEN 0 AND 10),
  star_analysis JSONB,
  ai_feedback TEXT,
  improved_answer TEXT,
  answered_at TIMESTAMPTZ
);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_resume_id ON public.resume_analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_jd_matches_resume_id ON public.jd_matches(resume_id);
CREATE INDEX IF NOT EXISTS idx_jd_matches_jd_id ON public.jd_matches(jd_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_qa_session_id ON public.interview_qa(session_id);

-- =============================================
-- Row Level Security (RLS)
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jd_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_qa ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Resumes: users can only CRUD their own resumes
CREATE POLICY "Users can CRUD own resumes" ON public.resumes
  FOR ALL USING (auth.uid() = user_id);

-- Resume Analyses: users can view analyses of their own resumes
CREATE POLICY "Users can view own resume analyses" ON public.resume_analyses
  FOR ALL USING (
    resume_id IN (SELECT id FROM public.resumes WHERE user_id = auth.uid())
  );

-- Job Descriptions: users can only CRUD their own JDs
CREATE POLICY "Users can CRUD own JDs" ON public.job_descriptions
  FOR ALL USING (auth.uid() = user_id);

-- JD Matches: users can view matches of their own resumes
CREATE POLICY "Users can view own JD matches" ON public.jd_matches
  FOR ALL USING (
    resume_id IN (SELECT id FROM public.resumes WHERE user_id = auth.uid())
  );

-- Interview Sessions: users can only CRUD their own sessions
CREATE POLICY "Users can CRUD own interviews" ON public.interview_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Interview QA: users can access QA of their own sessions
CREATE POLICY "Users can access own interview QA" ON public.interview_qa
  FOR ALL USING (
    session_id IN (SELECT id FROM public.interview_sessions WHERE user_id = auth.uid())
  );

-- =============================================
-- Trigger: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Storage Bucket for CV uploads
-- =============================================
-- Run this separately or via Supabase Dashboard:
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('cv-uploads', 'cv-uploads', false);
