import type { SupabaseClient } from "@supabase/supabase-js";
import { getAvatarUrl } from "~/db/user.server";
import type { Set, Term } from "~/util/types";
import { Err, errorResponse, Ok } from "~/util/util.server";

export async function getSetById(supabase: SupabaseClient, id: number) {
  const setResult = await supabase
    .from("sets_with_profiles")
    .select(`
      id,
      name,
      description,
      created_at,
      creator_id,
      creator_username,
      creator_avatar_url,
      terms (
        term,
        definition
      ) 
    `)
    .eq("id", id)
    .limit(1)
    .single();
 
  if (setResult.error) {
    return Err(errorResponse(`Failed to get set with id ${id}.`, 404));
  }

  const set = setResult.data;

  const terms = Array.isArray(set.terms) ? set.terms : [set.terms]; // Ensure terms is array

  return Ok({
    creator: {
      id: set.creator_id,
      username: set.creator_username,
      avatarUrl: await getAvatarUrl(supabase, set.creator_avatar_url)
    },
    id: set.id,
    name: set.name,
    description: set.description,
    createdAt: set.created_at,
    terms: terms
  } as Set & { terms: Term[] });
}

export async function getSets(supabase: SupabaseClient) {
  const setsResult = await supabase
    .from("sets_with_profiles")
    .select(`
      id,
      name,
      description,
      created_at,
      creator_id,
      creator_username,
      creator_avatar_url 
    `);
  
  if (setsResult.error) {
    return Err(errorResponse("Failed to get sets.", 404));
  }

  const sets = setsResult.data;
  
  return Ok(await Promise.all(sets.map(async set => ({
    creator: {
      id: set.creator_id,
      username: set.creator_username,
      avatarUrl: await getAvatarUrl(supabase, set.creator_avatar_url)
    },
    id: set.id,
    name: set.name,
    description: set.description,
    createdAt: set.created_at
  } as Set))));
}