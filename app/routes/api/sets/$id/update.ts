import { type ActionArgs, Response, json } from "@remix-run/node"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { createUserSupabaseClient } from "~/db/db.server"
import { updateSet } from "~/routes/sets/sets.server"
import { errorResponse, validateZodSchema, validationErrorResponse } from "~/util/util.server"
import { idSchema } from "~/util/validationSchemas"

const updateSetSchema = zfd.formData({
  name: zfd.text(),
  description: zfd.text(
    z.string().default("")
  ),
  public: zfd.checkbox()
})

export const action = async ({ request, params }: ActionArgs) => {
  const paramsResult = validateZodSchema(z.object({ id: idSchema }), params);
  if (!paramsResult.success) {
    return errorResponse("Invalid id.", 400);
  }

  const form = updateSetSchema.safeParse(await request.formData());
  if (!form.success) {
    return validationErrorResponse(form.error);
  }

  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);

  const editResult = await updateSet(supabase, paramsResult.data.id, form.data);
  if (!editResult.success) {
    return editResult.response;
  }

  return json({ success: true }, { status: 200 });
}

