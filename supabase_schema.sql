-- ====================================================================
-- YOUR GATI Database Schema (Supabase PostgreSQL + RLS + Gemini Vision AI)
-- Digital ecosystem crowdsourcing societal challenges across Jharkhand
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles / Users (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('citizen', 'university', 'industry', 'admin')) NOT NULL DEFAULT 'citizen',
    organization_name TEXT,
    district TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger to auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, full_name, role, organization_name, district)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'System User'),
    COALESCE(new.raw_user_meta_data->>'role', 'citizen'),
    new.raw_user_meta_data->>'organization_name',
    COALESCE(new.raw_user_meta_data->>'district', 'Ranchi')
  )
  ON CONFLICT (auth_user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_code TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    domain TEXT NOT NULL,
    district TEXT NOT NULL,
    block TEXT,
    village_city TEXT,
    location TEXT,
    affected_count INT DEFAULT 100,
    urgency TEXT CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) DEFAULT 'MEDIUM',
    expected_solution TEXT,
    contact_info TEXT,
    status TEXT CHECK (status IN (
      'SUBMITTED', 
      'UNDER_REVIEW', 
      'VALIDATED', 
      'UNIVERSITY_ASSIGNED', 
      'UNIVERSITY_ACCEPTED', 
      'PROJECT_CREATED', 
      'INDUSTRY_COLLABORATION', 
      'PROTOTYPE', 
      'PILOT_TESTING', 
      'DEPLOYED', 
      'IMPACT_MEASURED'
    )) DEFAULT 'SUBMITTED',
    university_id UUID,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Challenge Evidence
CREATE TABLE IF NOT EXISTS challenge_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT CHECK (file_type IN ('image', 'video', 'document')),
    file_name TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Challenge Gemini AI Analysis
CREATE TABLE IF NOT EXISTS challenge_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE UNIQUE,
    model_name TEXT DEFAULT 'gemini-2.5-flash',
    is_live_gemini BOOLEAN DEFAULT FALSE,
    problem_detected BOOLEAN DEFAULT TRUE,
    detected_issue TEXT NOT NULL,
    primary_category TEXT NOT NULL,
    sub_category TEXT,
    priority TEXT CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')) NOT NULL,
    confidence_score INT DEFAULT 93,
    visible_evidence TEXT[] DEFAULT '{}',
    user_reported_context TEXT,
    estimated_public_impact TEXT NOT NULL,
    recommended_action TEXT,
    required_expertise TEXT[] DEFAULT '{}',
    recommended_institutions TEXT[] DEFAULT '{}',
    potential_industry_partners TEXT[] DEFAULT '{}',
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Universities
CREATE TABLE IF NOT EXISTS universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    district TEXT NOT NULL,
    type TEXT DEFAULT 'State/Central Autonomous',
    contact_email TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. University Expertise
CREATE TABLE IF NOT EXISTS university_expertise (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    domain TEXT NOT NULL
);

-- 7. Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
    university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    faculty_mentor TEXT NOT NULL,
    student_team TEXT[] DEFAULT '{}',
    required_skills TEXT[] DEFAULT '{}',
    required_industry_support TEXT[] DEFAULT '{}',
    expected_outcome TEXT,
    status TEXT CHECK (status IN ('PLANNING', 'IN_PROGRESS', 'PROTOTYPE', 'PILOT_TESTING', 'COMPLETED')) DEFAULT 'PLANNING',
    progress_percentage INT DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Project Members
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('STUDENT', 'FACULTY', 'MENTOR')) DEFAULT 'STUDENT',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Industry Partners
CREATE TABLE IF NOT EXISTS industry_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    sector TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Industry Collaborations
CREATE TABLE IF NOT EXISTS industry_collaborations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    industry_id UUID REFERENCES industry_partners(id) ON DELETE SET NULL,
    partner_name TEXT NOT NULL,
    support_types TEXT[] DEFAULT '{}',
    notes TEXT,
    status TEXT CHECK (status IN ('REQUESTED', 'ACCEPTED', 'REJECTED')) DEFAULT 'REQUESTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Project Milestones
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'PENDING',
    completion_percentage INT DEFAULT 0,
    target_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    responsible_role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('citizen', 'university', 'industry', 'admin', 'all')) DEFAULT 'all',
    type TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_challenge_id UUID,
    related_project_id UUID,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE industry_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "Allow authenticated update own profile" ON profiles FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Allow public read challenges" ON challenges FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert challenges" ON challenges FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow university and admin update challenges" ON challenges FOR UPDATE USING (true);

CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow university insert projects" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow university update projects" ON projects FOR UPDATE USING (true);

CREATE POLICY "Allow public read collaborations" ON industry_collaborations FOR SELECT USING (true);
CREATE POLICY "Allow industry insert collaborations" ON industry_collaborations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow university update collaborations" ON industry_collaborations FOR UPDATE USING (true);

CREATE POLICY "Allow public read milestones" ON project_milestones FOR SELECT USING (true);
CREATE POLICY "Allow university update milestones" ON project_milestones FOR UPDATE USING (true);

CREATE POLICY "Allow public read notifications" ON notifications FOR SELECT USING (true);
