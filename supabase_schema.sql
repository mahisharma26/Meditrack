-- ==============================================================================
-- MediTrack – Supabase Database Schema & Row Level Security (RLS)
-- Copy and run this script in the Supabase SQL Editor:
-- Dashboard -> Project -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Linked to Supabase Auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  full_name_hindi TEXT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'guardian', 'admin')),
  phone TEXT,
  avatar TEXT,
  connection_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Patient - Guardian Connections (Family Circle)
CREATE TABLE IF NOT EXISTS public.patient_guardians (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  guardian_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  relationship TEXT NOT NULL, -- e.g. Daughter, Son, Caregiver
  status TEXT DEFAULT 'connected' CHECK (status IN ('pending', 'connected', 'rejected', 'revoked')),
  can_view_schedule BOOLEAN DEFAULT true,
  can_edit_medicines BOOLEAN DEFAULT true,
  can_manage_stock BOOLEAN DEFAULT true,
  can_receive_alerts BOOLEAN DEFAULT true,
  can_view_prescriptions BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(patient_id, guardian_id)
);

-- 4. Prescribed Medicines Table
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  type TEXT NOT NULL, -- Tablet, Capsule, Syrup, etc.
  category TEXT,
  visual_color TEXT,
  visual_shape TEXT,
  visual_markings TEXT,
  visual_image TEXT,
  instructions TEXT NOT NULL,
  instructions_hindi TEXT,
  meal_relation TEXT, -- before_meal, with_meal, after_meal, anytime
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g. [{"timeSlot":"morning","time":"08:30"}]
  current_qty INT NOT NULL DEFAULT 30,
  unit TEXT NOT NULL DEFAULT 'tablets',
  reorder_threshold INT NOT NULL DEFAULT 7,
  expiry_date DATE NOT NULL,
  prescribed_by TEXT,
  prescription_id UUID,
  is_active BOOLEAN DEFAULT true,
  is_sos BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Dose Confirmations Log (Adherence Records)
CREATE TABLE IF NOT EXISTS public.dose_confirmations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  time_slot TEXT NOT NULL, -- morning, afternoon, evening, night
  dose_date DATE NOT NULL,
  dose_time TIME NOT NULL,
  confirmed_by TEXT NOT NULL, -- 'patient' or 'caregiver'
  confirmed_by_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(medicine_id, time_slot, dose_date)
);

-- 6. Stock Adjustments Audit Log
CREATE TABLE IF NOT EXISTS public.stock_adjustments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  old_qty INT NOT NULL,
  new_qty INT NOT NULL,
  reason TEXT NOT NULL,
  adjusted_by UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Prescription Vault Documents
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_name TEXT NOT NULL,
  specialty TEXT,
  clinic TEXT,
  consultation_date DATE NOT NULL,
  diagnosis TEXT,
  notes TEXT,
  notes_hindi TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dose_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile and connected family members
CREATE POLICY "Users can view profile" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.patient_guardians 
      WHERE (patient_id = id AND guardian_id = auth.uid()) OR (guardian_id = id AND patient_id = auth.uid())
    )
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Medicines: Patients can read their own medicines. Connected Guardians can read and update them.
CREATE POLICY "Access medicines policy" ON public.medicines
  FOR ALL USING (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.patient_guardians 
      WHERE patient_id = medicines.patient_id AND guardian_id = auth.uid() AND status = 'connected'
    )
  );

-- Dose Confirmations: Patients and their authorized guardians can view and record confirmations
CREATE POLICY "Access dose confirmations policy" ON public.dose_confirmations
  FOR ALL USING (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.patient_guardians 
      WHERE patient_id = dose_confirmations.patient_id AND guardian_id = auth.uid() AND status = 'connected'
    )
  );

-- Prescriptions: Shared between patient and authorized guardians
CREATE POLICY "Access prescriptions policy" ON public.prescriptions
  FOR ALL USING (
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.patient_guardians 
      WHERE patient_id = prescriptions.patient_id AND guardian_id = auth.uid() AND status = 'connected'
    )
  );

-- ==============================================================================
-- STORAGE BUCKETS (FOR PRESCRIPTION UPLOADS & PILL PHOTOS)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('pill_photos', 'pill_photos', true)
ON CONFLICT (id) DO NOTHING;
