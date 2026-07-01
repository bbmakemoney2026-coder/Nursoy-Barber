
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_slug TEXT NOT NULL CHECK (barber_slug IN ('nurullah', 'ismail')),
  service TEXT NOT NULL,
  appointment_at TIMESTAMPTZ NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (barber_slug, appointment_at)
);

GRANT SELECT, INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a booking
CREATE POLICY "Anyone can create a booking"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Nobody can read raw rows via the Data API (personal info stays private).
-- Availability lookups go through the security-definer function below.

CREATE OR REPLACE FUNCTION public.get_taken_slots(p_barber TEXT, p_from TIMESTAMPTZ, p_to TIMESTAMPTZ)
RETURNS TABLE (appointment_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_at
  FROM public.bookings
  WHERE barber_slug = p_barber
    AND appointment_at >= p_from
    AND appointment_at < p_to;
$$;

GRANT EXECUTE ON FUNCTION public.get_taken_slots(TEXT, TIMESTAMPTZ, TIMESTAMPTZ) TO anon, authenticated;
