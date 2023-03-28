import { type ActionArgs, redirect } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { useActionData, Form, useNavigation, Link } from "@remix-run/react";
import { z } from "zod";
import { ErrorText, HorizontalDivider, Input, SubmitButton } from "~/components/common";
import { createUserSupabaseClient } from "~/db/db.server";
import { login } from "~/db/user.server";
import { type ErrorResponse, validateZodSchema } from "~/util/util.server";


const loginFormSchema = z.object({
  email: z
  .string({
    invalid_type_error: "Email must be text.",
    required_error: "Email is required to log in."
  })
  .email("Email entered is not a valid email"),
  
  password: z.string({
    invalid_type_error: "Password must be text.",
    required_error: "Password is required to log in."
  })
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
 
  const form = validateZodSchema(loginFormSchema, body);
  if (!form.success) {
    return form.response;
  }

  const response = new Response();

  const loginResult = await login(request, response, form.data);
  if (!loginResult.success) {
    return loginResult.response;
  }

  return redirect("/", { headers: response.headers });
}

export default function Login() {
  const errors: ErrorResponse | undefined = useActionData<typeof action>();
  const navigation = useNavigation();

  const fieldErrors = errors?.validationErrors?.fieldErrors

  return (
    <div className="flex flex-col items-center">
      <Form method="post" className="flex flex-col gap-4 items-stretch border border-gray-600 rounded-md p-5 w-full sm:w-[400px]">
        <div>
          <h2 className="text-3xl">Login</h2>
          <p>Don't have an account? <Link className="text-teal-500 hover:text-teal-300" to="/register">Register</Link>.</p>
        </div>
        <HorizontalDivider />        
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
        <SubmitButton loading={navigation.state !== "idle"}>Login</SubmitButton>
        <div>
          <p>Test account:</p>
          <p>connormcummings@gmail.com</p>
          <p>mcXJ82EGUtEzZM6</p>
        </div>
      </Form>
    </div>
  );
}
