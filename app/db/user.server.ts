import type { Response } from "@remix-run/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "~/util/types";
import { Err, errorResponse, Ok } from "~/util/util.server";
import { createUserSupabaseClient } from "./db.server";

type SignUpCredentials = {
  username: string,
  email: string,
  password: string
}

export async function signUp(request: Request, response: Response, credentials: SignUpCredentials) {
  const supabase = createUserSupabaseClient(request, response);

  const { error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        username: credentials.username
      }
    }
  });
  
  if (error) {
    return Err(errorResponse("Failed to sign up.", error.status));
  }

  return Ok(null);
}


type LoginCredentials = {
  email: string,
  password: string
}

export async function login(request: Request, response: Response, credentials: LoginCredentials) {
  const supabase = createUserSupabaseClient(request, response);
  
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });

  if (error) {
    return Err(errorResponse("Failed to log in.", error.status));
  }

  return Ok(null);
}


export async function logout(request: Request, response: Response) {
  const supabase = createUserSupabaseClient(request, response);

  const { error } = await supabase.auth.signOut();

  if (error) {
    return Err(errorResponse("Failed to log out.", error.status));
  }

  return Ok(null);
}


export async function getUser(request: Request, response: Response) {
  const supabase = createUserSupabaseClient(request, response);
  
  const userResult = await supabase.auth.getUser();
  if (userResult.error) {
    return Err(errorResponse("Failed to get user.", userResult.error.status));
  }

  return await getUserById(supabase, userResult.data.user.id);
}


export async function getUserById(supabase: SupabaseClient, id: number | string) {
  const userResult = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      avatar_url 
    `)
    .eq("id", id)
    .limit(1)
    .single();

  if (userResult.error) {
    return Err(errorResponse("Failed to get user profile.", userResult.status));
  }

  const user = userResult.data;

  return Ok({
    id: user.id,
    username: user.username,
    avatarUrl: await getAvatarUrl(supabase, user.avatar_url)
  } as User)
}


export async function getAvatarUrl(supabase: SupabaseClient, dbUrl: string) {
  const avatarResult = await supabase
    .storage
    .from("avatars")
    .createSignedUrl(dbUrl, 60);

  if (avatarResult.error) {
    return undefined;
  }

  return avatarResult.data.signedUrl;
}