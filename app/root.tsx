import stylesheet from "~/tailwind.css";
import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, Response } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Navbar from "./components/Navbar";
import { getUser } from "./db/user.server";
import { UserContext } from "./user";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "ezstudy",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();

  const userResult = await getUser(request, response);
 
  return json({ user: userResult.success ? userResult.data : undefined }, { headers: response.headers }); 
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-900 text-white">
        <UserContext.Provider value={user}>
          <Navbar />
          <main className="mt-10 px-3 md:px-40 xl:px-64 2xl:px-96">
            <Outlet />
          </main>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </UserContext.Provider>
      </body>
    </html>
  );
}
