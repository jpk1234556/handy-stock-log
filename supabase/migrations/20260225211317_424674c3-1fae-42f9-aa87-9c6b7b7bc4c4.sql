-- Drop all restrictive policies and recreate as permissive

-- categories
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
CREATE POLICY "Authenticated users can manage categories" ON public.categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- items
DROP POLICY IF EXISTS "Authenticated users can manage items" ON public.items;
CREATE POLICY "Authenticated users can manage items" ON public.items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- profiles
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- stock_history
DROP POLICY IF EXISTS "Authenticated users can insert stock history" ON public.stock_history;
CREATE POLICY "Authenticated users can insert stock history" ON public.stock_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can view stock history" ON public.stock_history;
CREATE POLICY "Authenticated users can view stock history" ON public.stock_history
  FOR SELECT TO authenticated USING (true);