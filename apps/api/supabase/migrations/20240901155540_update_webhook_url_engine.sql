-- Atualizar função para chamar webhook da aplicação engine
CREATE OR REPLACE FUNCTION public.handle_user_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Chamar nossa API engine
  PERFORM http_post(
    url := 'http://localhost:3004/webhooks/supabase',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := json_build_object(
      'type', 'INSERT',
      'table', 'users',
      'record', json_build_object(
        'id', NEW.id,
        'email', NEW.email,
        'full_name', NEW.raw_user_meta_data->>'full_name',
        'avatar_url', NEW.raw_user_meta_data->>'avatar_url',
        'created_at', NEW.created_at,
        'updated_at', NEW.updated_at
      )
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comentário explicativo
COMMENT ON FUNCTION public.handle_user_webhook() IS 'Chama webhook da aplicação engine quando usuário é criado no auth.users';
