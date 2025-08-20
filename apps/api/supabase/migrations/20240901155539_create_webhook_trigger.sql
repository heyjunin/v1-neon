-- Criar função para chamar webhook quando usuário é criado
CREATE OR REPLACE FUNCTION public.handle_user_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Chamar nossa API local
  PERFORM http_post(
    url := 'http://localhost:3000/api/webhooks/supabase',
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

-- Criar trigger para chamar a função quando usuário é criado
CREATE TRIGGER on_auth_user_webhook
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_webhook();

-- Comentário explicativo
COMMENT ON FUNCTION public.handle_user_webhook() IS 'Chama webhook da aplicação quando usuário é criado no auth.users';
COMMENT ON TRIGGER on_auth_user_webhook ON auth.users IS 'Trigger para sincronizar usuários com banco principal via webhook';
