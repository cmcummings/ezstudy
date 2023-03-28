import { type ActionArgs, Response, redirect } from "@remix-run/node"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { createUserSupabaseClient } from "~/db/db.server"
import { insertSet } from "~/routes/sets/sets.server"
import { errorResponse, validationErrorResponse } from "~/util/util.server"

const updateSetSchema = zfd.formData({
  name: zfd.text(),
  description: zfd.text(
    z.string().default("")
  ),
  public: zfd.checkbox()
})

export const action = async ({ request, params }: ActionArgs) => {
  const form = updateSetSchema.safeParse(await request.formData());
  if (!form.success) {
    return validationErrorResponse(form.error);
  }

  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);

  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;
  if (userResult.error || !user) {
    return errorResponse("Not logged in.", 403)
  }

  const insertResult = await insertSet(supabase, user.id, form.data);
  if (!insertResult .success) {
    return insertResult.response;
  }

  return redirect(`/sets/${insertResult.data.id}`);
}

