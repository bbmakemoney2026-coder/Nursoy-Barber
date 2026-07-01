
-- Remove SECURITY DEFINER function; use column-level SELECT + RLS instead.
DROP FUNCTION IF EXISTS public.get_taken_slots(TEXT, TIMESTAMPTZ, TIMESTAMPTZ);

-- Revoke default SELECT to reset, then grant only non-PII columns to anon/auth.
REVOKE SELECT ON public.bookings FROM anon, authenticated;
GRANT SELECT (barber_slug, appointment_at) ON public.bookings TO anon, authenticated;

CREATE POLICY "Anyone can view taken slots"
  ON public.bookings FOR SELECT
  TO anon, authenticated
  USING (true);
