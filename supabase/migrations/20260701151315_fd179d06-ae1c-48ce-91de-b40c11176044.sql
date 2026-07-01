
-- Replace overly-permissive INSERT policy with basic validation
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;

CREATE POLICY "Anyone can create a valid booking"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(customer_name) BETWEEN 2 AND 100
    AND length(phone) BETWEEN 6 AND 30
    AND length(service) BETWEEN 2 AND 80
    AND (note IS NULL OR length(note) <= 500)
    AND appointment_at > now()
    AND appointment_at < now() + interval '90 days'
  );

COMMENT ON FUNCTION public.get_taken_slots(TEXT, TIMESTAMPTZ, TIMESTAMPTZ)
  IS 'Public availability lookup for the booking page. Returns only timestamps of taken slots, never customer PII.';
