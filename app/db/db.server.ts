import type { Response } from "@remix-run/node";
import type { Database } from "./database.types";
import { createServerClient } from "@supabase/auth-helpers-remix";
import * as dotenv from "dotenv";
dotenv.config();


export function createUserSupabaseClient(request: Request, response: Response) {
  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { request, response }
  );

  return supabase;
}

type Tables = Database["public"]["Tables"];
export type DbProfile = Tables["profiles"]["Row"];
export type DbSet = Tables["sets"]["Row"];
export type DbTerm = Tables["terms"]["Row"];
