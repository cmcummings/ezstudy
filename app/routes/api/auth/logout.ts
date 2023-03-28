import { type ActionArgs, redirect, Response, json } from "@remix-run/node";
import { logout } from "~/db/user.server";

export const action = async ({ request }: ActionArgs) => {  
  if (request.method !== "POST") {
    return json("Invalid method.", { status: 400 });
  }

  const response = new Response();

  const logoutResult = await logout(request, response);
  if (!logoutResult.success) {
    return logoutResult.response;
  }

  return redirect("/", { headers: response.headers });
}
