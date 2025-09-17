-- Create a helper function to check if the current user is a teacher without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_teacher(_auth_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  select exists (
    select 1 from public.users u where u.auth_id = _auth_id and u.role = 'teacher'
  );
$$;

-- Drop the recursive policy and recreate using the helper function
DROP POLICY IF EXISTS "Teachers can view all users" ON public.users;

CREATE POLICY "Teachers can view all users"
ON public.users
FOR SELECT
USING (public.is_teacher(auth.uid()));