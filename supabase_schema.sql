-- ==========================================
-- SMILEDENTAL CRM CLINIC SQL SCHEMA DEFINITIONS
-- For Supabase / PostgreSQL Database setup
-- ==========================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PUBLIC PROFILES TABLE (Linked with auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Staff',
    status TEXT NOT NULL DEFAULT 'Aktif',
    permissions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PATIENTS TABLE
CREATE TABLE public.patients (
    id TEXT PRIMARY KEY, -- format: 'PT-001'
    name TEXT NOT NULL,
    gender TEXT NOT NULL,
    age INTEGER NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT,
    registered_date DATE NOT NULL DEFAULT CURRENT_DATE,
    membership_status TEXT NOT NULL DEFAULT 'Aktif',
    membership_level TEXT NOT NULL DEFAULT 'Bronze',
    complaint TEXT,
    status TEXT NOT NULL DEFAULT 'Aktif',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DOCTORS TABLE
CREATE TABLE public.doctors (
    id TEXT PRIMARY KEY, -- format: 'DOC-001'
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Aktif',
    phone TEXT,
    rating NUMERIC(3,2) DEFAULT 5.00,
    visits INTEGER DEFAULT 0,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. APPOINTMENT SCHEDULES TABLE
CREATE TABLE public.schedules (
    id TEXT PRIMARY KEY, -- format: 'SCH-001'
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    doctor TEXT NOT NULL,
    complaint TEXT,
    status TEXT NOT NULL DEFAULT 'Menunggu',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TRANSACTIONS TABLE
CREATE TABLE public.transactions (
    id TEXT PRIMARY KEY, -- format: 'TX-1001'
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    patient_name TEXT NOT NULL,
    date DATE NOT NULL,
    service TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Berhasil',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. DENTAL RECORDS (REKAM MEDIS) TABLE
CREATE TABLE public.dental_records (
    id TEXT PRIMARY KEY, -- format: 'REC-001'
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    date DATE NOT NULL,
    doctor TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT NOT NULL,
    notes TEXT,
    control_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TREATMENTS (SERVICE CATALOG) TABLE
CREATE TABLE public.treatments (
    id TEXT PRIMARY KEY, -- format: 'TR-001'
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    duration TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. CUSTOMER ACTIVITIES (LOG) TABLE
CREATE TABLE public.customer_activities (
    id TEXT PRIMARY KEY, -- format: 'ACT-001'
    patient_name TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. FEEDBACKS & REVIEWS TABLE
CREATE TABLE public.feedbacks (
    id TEXT PRIMARY KEY, -- format: 'FB-001'
    patient_name TEXT NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    doctor_name TEXT,
    comment TEXT,
    date DATE NOT NULL,
    type TEXT NOT NULL, -- e.g. 'Pujian', 'Saran', 'Keluhan'
    status TEXT NOT NULL DEFAULT 'Selesai',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. LOYALTY POINTS BALANCE TABLE
CREATE TABLE public.loyalty_rewards_points (
    patient_id TEXT PRIMARY KEY REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    balance INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'Bronze',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. LOYALTY VOUCHER REDEMPTIONS TABLE
CREATE TABLE public.loyalty_rewards_redemptions (
    id TEXT PRIMARY KEY, -- format: 'RDP-001'
    patient_name TEXT NOT NULL,
    voucher_name TEXT NOT NULL,
    points_used INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
    id TEXT PRIMARY KEY, -- format: 'NT-001'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    date DATE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);


-- ==========================================
-- TRIGGERS FOR PROFILE SYNC FROM AUTH
-- ==========================================

-- Function to handle new registered users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, name, role, status, permissions)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'name', 'Staff Baru'),
    COALESCE(new.raw_user_meta_data->>'role', 'Staff'),
    'Aktif',
    ARRAY['READ_PATIENTS', 'READ_TRANSACTIONS']
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- (Optional: Enable RLS and create policy to allow authenticated staff)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dental_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Creating general Select/Insert/Update/Delete Policies for authenticated users
CREATE POLICY "Allow authenticated users access to profiles" 
  ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to patients" 
  ON public.patients FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to doctors" 
  ON public.doctors FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to schedules" 
  ON public.schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to transactions" 
  ON public.transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to dental_records" 
  ON public.dental_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to treatments" 
  ON public.treatments FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to customer_activities" 
  ON public.customer_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to feedbacks" 
  ON public.feedbacks FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to loyalty_rewards_points" 
  ON public.loyalty_rewards_points FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to loyalty_rewards_redemptions" 
  ON public.loyalty_rewards_redemptions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users access to notifications" 
  ON public.notifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
