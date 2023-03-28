import { redirect, Response } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { Input, ErrorText, HorizontalDivider, SubmitButton } from "~/components/common";
import { signUp } from "~/db/user.server";
import { type ErrorResponse, validateZodSchema } from "~/util/util.server";
import { createUserSupabaseClient } from "~/db/db.server";

const registerFormSchema = z.object({
  username: z
  .string({
    invalid_type_error: "Username must be text.",
    required_error: "Username is required."
  })
  .min(3, "Username must be at least 3 characters long.")
  .max(20, "Username must be less than 20 characters long."),
  
  email: z
  .string({
    invalid_type_error: "Email must be text.",
    required_error: "Email is required."
  })
  .email("Email entered is not a valid email."),
  
  password: z
  .string({
    invalid_type_error: "Password must be text.",
    required_error: "Password is required."
  })
  .min(5, "Password must be at least 5 characters long.")
  .max(40, "Password must be less than 40 characters long.")
})

export const loader = async({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createUserSupabaseClient(request, response);
  const user = await supabase.auth.getUser();
  if (!user.error && user.data.user) {
    return redirect("/sets");
  }

  return null;
}

export const action = async ({ request }: ActionArgs) => {
  const body = Object.fromEntries(await request.formData());

  const form = validateZodSchema(registerFormSchema, body);
  if (!form.success) {
    return form.response;
  }
  
  const response = new Response();

  const signUpResult = await signUp(request, response, form.data);
  if (!signUpResult.success) {
    return signUpResult.response;
  }

  return redirect("/", { headers: response.headers });
}


export default function Register() {
  const errors: ErrorResponse | undefined = useActionData<typeof action>();
  const navigation = useNavigation();

  const fieldErrors = errors?.validationErrors?.fieldErrors

  return (
    <div className="flex flex-col items-center">
      <Form method="post" className="flex flex-col gap-4 items-stretch border border-gray-600 rounded-md p-5 w-full sm:w-[400px]">
        <div>
          <h2 className="text-3xl">Register</h2>
          <p>Already have an account? <Link className="text-teal-500 hover:text-teal-300" to="/login">Login</Link>.</p>
        </div>
        <HorizontalDivider />        
        <div className="flex flex-col gap-1 items-stretch">
          <label htmlFor="username">Username</label>
          <Input type="text" name="username" placeholder="Username" />
          {fieldErrors?.username ? <ErrorText text={fieldErrors.username.join("\n")} /> : null}
        </div>
        <div className="flex flex-col gap-1 items-stretch">
          <label htmlFor="username">Email</label>
          <Input type="email" name="email" placeholder="Email" />
          {fieldErrors?.email ? <ErrorText text={fieldErrors.email.join("\n")} /> : null}
        </div>
        <div className="flex flex-col gap-1 items-stretch">
          <label htmlFor="username">Password</label>
          <Input type="password" name="password" placeholder="Password" />
          {fieldErrors?.password ? <ErrorText text={fieldErrors.password.join("\n")} /> : null}
        </div>
        <SubmitButton loading={navigation.state !== "idle"}>Register</SubmitButton>
      </Form>
    </div>
  )
}
