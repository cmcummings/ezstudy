import { json, } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { createUserSupabaseClient } from "~/db/db.server";
import { errorResponse, validateZodSchema } from "~/util/util.server";
import { getSetById } from "./sets.server";
import { z } from "zod";
import { Response } from "@remix-run/node";

const setParamsSchema = z.object({
  id: z.coerce
  .number({
    invalid_type_error: "Set id must be an integer.",
    required_error: "Set id is required."
  })
  .int("Set id must be an integer.")
  .positive("Set id must be positive.")
})

export const loader = async ({ request, params }: LoaderArgs) => {
  const paramsResult = validateZodSchema(setParamsSchema, params);
  if (!paramsResult.success) {
    throw errorResponse("Invalid set id.", 400);
  }

  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);

  const setResult = await getSetById(supabase, paramsResult.data.id);
  if (!setResult.success) {
    throw setResult.response;
  }

  return json({ set: setResult.data }, { headers: response.headers });
}


export default function Set() {
  const { set } = useLoaderData<typeof loader>();

  return <Outlet context={set} />
}