import { type ActionArgs, Response, json } from "@remix-run/node"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { createUserSupabaseClient } from "~/db/db.server"
import { updateTerm } from "~/routes/sets/sets.server"
import { errorResponse, validateZodSchema, validationErrorResponse } from "~/util/util.server"
import { idSchema } from "~/util/validationSchemas"

const updateTermSchema = zfd.formData({
  term: zfd.text(),
  definition: zfd.text()
})

export const action = async ({ request, params }: ActionArgs) => {
  const paramsResult = validateZodSchema(z.object({ id: idSchema }), params);
  if (!paramsResult.success) {
    return errorResponse("Invalid id.", 400);
  }

  const form = updateTermSchema.safeParse(await request.formData());
  if (!form.success) {
    return validationErrorResponse(form.error);
  }

  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);

  const result = await updateTerm(supabase, paramsResult.data.id, form.data);
  if (!result.success) {
    return result.response;
  }

  return json({ success: true }, { status: 200 });
}

