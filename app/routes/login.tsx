import { type ActionArgs, redirect } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { z } from "zod";
import { ErrorText, HorizontalDivider, Input, Button } from "~/components/common";
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

export default function Register() {
  const errors: ErrorResponse | undefined = useActionData<typeof action>();

  const fieldErrors = errors?.validationErrors?.fieldErrors

  return (
    <div className="flex flex-col items-center">
      <Form method="post" className="flex flex-col gap-4 items-start border border-gray-600 rounded-md p-5">
        <h2 className="text-3xl">Login</h2>
        <HorizontalDivider />        
        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="username">Email</label>
          <Input type="email" name="email" placeholder="Email" />
          {fieldErrors?.email ? <ErrorText text={fieldErrors.email.join("\n")} /> : null}
        </div>
        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="username">Password</label>
          <Input type="password" name="password" placeholder="Password" />
          {fieldErrors?.password ? <ErrorText text={fieldErrors.password.join("\n")} /> : null}
        </div>
        <Button type="submit" className="self-end">Login</Button>
      </Form>
    </div>
  );
}
