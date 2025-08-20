import type { User } from "@supabase/supabase-js";
import { createUser, updateUser } from "@v1/database/mutations";
import { getUserByEmail } from "@v1/database/queries";
import { logger } from "@v1/logger";
import { createClient } from "@v1/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      try {
        // Sincronizar usuário com o banco Neon
        await syncUserWithDatabase(data.user);
        
        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocalEnv = process.env.NODE_ENV === "development";

        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        }
        if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        }
        return NextResponse.redirect(`${origin}${next}`);
      } catch (syncError) {
        logger.error('Error syncing user with database:', syncError);
        // Mesmo com erro na sincronização, redirecionar o usuário
        // O erro será logado para debug
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}?error=auth-code-error`);
}

async function syncUserWithDatabase(supabaseUser: User) {
  try {
    const { id, email, user_metadata } = supabaseUser;
    
    if (!email) {
      logger.warn('User has no email, skipping sync:', { id });
      return;
    }

    // Verificar se o usuário já existe no banco Neon
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      // Atualizar usuário existente se necessário
      const updateData: any = {};
      
      if (user_metadata?.full_name && user_metadata.full_name !== existingUser.fullName) {
        updateData.fullName = user_metadata.full_name;
      }
      
      if (user_metadata?.avatar_url && user_metadata.avatar_url !== existingUser.avatarUrl) {
        updateData.avatarUrl = user_metadata.avatar_url;
      }
      
      if (Object.keys(updateData).length > 0) {
        await updateUser(existingUser.id, updateData);
        logger.info('User updated in database:', { id: existingUser.id, email });
      }
    } else {
      // Criar novo usuário no banco Neon
      const newUserData = {
        id,
        email,
        fullName: user_metadata?.full_name || null,
        avatarUrl: user_metadata?.avatar_url || null,
      };
      
      await createUser(newUserData);
      logger.info('User created in database:', { id, email });
    }
  } catch (error) {
    logger.error('Error in syncUserWithDatabase:', error);
    throw error;
  }
}
