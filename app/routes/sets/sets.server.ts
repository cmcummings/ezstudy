import type { SupabaseClient } from "@supabase/supabase-js";
import { getAvatarUrl } from "~/db/user.server";
import type { Set, Term } from "~/util/types";
import { Err, errorResponse, Ok } from "~/util/util.server";

type InitialSetAttributes = {
  name: string,
  description?: string
  public?: boolean
}

export async function insertSet(supabase: SupabaseClient, creatorId: string | number, props: InitialSetAttributes) {
  const result = await supabase
    .from("sets")
    .insert({
      creator_id: creatorId,
      ...props
    })
    .select(`id`)
    .limit(1)
    .single()

  if (result.error) {
    return Err(errorResponse("Could not insert a new set.", 500))
  }

  return Ok({
    id: result.data.id
  })
}

export async function getSetById(supabase: SupabaseClient, id: number) {
  const setResult = await supabase
    .from("sets_with_profiles")
    .select(`
      id,
      name,
      description,
      public,
      created_at,
      creator_id,
      creator_username,
      creator_avatar_url,
      terms (
        id,
        term,
        definition
      ) 
    `)
    .eq("id", id)
    .order('id', { foreignTable: 'terms', ascending: true })
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
    public: set.public,
    description: set.description,
    createdAt: set.created_at,
    terms: terms
  } as Set & { terms: Term[] });
}

export async function getSetsByCreatorId(supabase: SupabaseClient, creatorId: string | number) {
  const setsResult = await supabase
    .from("sets_with_profiles")
    .select(`
      id,
      name,
      description,
      public,
      created_at,
      creator_id,
      creator_username,
      creator_avatar_url 
    `)
    .eq("creator_id", creatorId);
  
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
    public: set.public,
    description: set.description,
    createdAt: set.created_at
  } as Set))));
}


type SetUpdateableAttributes = {
  name?: string,
  description?: string,
  public?: boolean
}

export async function updateSet(supabase: SupabaseClient, id: string | number, edits: SetUpdateableAttributes) {
  const result = await supabase
    .from("sets")
    .update(edits)
    .eq("id", id);

  if (result.error) {
    return Err(errorResponse("Failed to update set.", 500));
  }

  return Ok(true);
}

export async function insertTerm(supabase: SupabaseClient, setId: string | number, term: { term: string, definition: string }) {
  const result = await supabase
    .from("terms")
    .insert({
      set_id: setId,
      ...term
    })

  if (result.error) {
    return Err(errorResponse("Failed to insert term.", 500));
  }

  return Ok(true);
}

export async function updateTerm(supabase: SupabaseClient, termId: string | number, term: { term: string, definition: string }) {
  const result = await supabase
    .from("terms")
    .update({
      ...term
    })
    .eq("id", termId)

  if (result.error) {
    return Err(errorResponse("Failed to insert term.", 500));
  }

  return Ok(true);
}