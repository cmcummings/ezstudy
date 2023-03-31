import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { validateZodSchema, errorResponse } from "~/util/util.server";
import { idSchema } from "~/util/validationSchemas";
import { z } from "zod";
import { createUserSupabaseClient } from "~/db/db.server";
import { deleteTerm } from "~/routes/sets/sets.server";

export const action = async ({ request, params }: ActionArgs) => {
  const paramsResult = validateZodSchema(z.object({ id: idSchema }), params);
  if (!paramsResult.success) {
    return errorResponse("Invalid id.", 400);
  }

  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);

  const deleteResult = await deleteTerm(supabase, paramsResult.data.id);
  if (!deleteResult.success) {
    return deleteResult.response;
  }

  return json({ success: true, message: "Deleted term." });
}