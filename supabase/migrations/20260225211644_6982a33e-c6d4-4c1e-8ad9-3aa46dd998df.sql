ALTER TABLE public.stock_history DROP CONSTRAINT stock_history_user_id_fkey;
ALTER TABLE public.stock_history
  ADD CONSTRAINT stock_history_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);