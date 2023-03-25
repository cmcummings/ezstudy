import { redirect, Response } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { Input, Button, ErrorText, HorizontalDivider } from "~/components/common";
import { signUp } from "~/db/user.server";
import { type ErrorResponse, validateZodSchema } from "~/util/util.server";

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

  const fieldErrors = errors?.validationErrors?.fieldErrors

  return (
    <div className="flex flex-col items-center">
      <Form method="post" className="flex flex-col gap-4 items-start border border-gray-600 rounded-md p-5">
        <h2 className="text-3xl">Register</h2>
        <HorizontalDivider />        
        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="username">Username</label>
          <Input type="text" name="username" placeholder="Username" />
          {fieldErrors?.username ? <ErrorText text={fieldErrors.username.join("\n")} /> : null}
        </div>
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
        <Button type="submit" className="self-end">Register</Button>
      </Form>
    </div>
  )
}
