import type { LoaderArgs } from "@remix-run/node";
import type { Set } from "~/util/types";
import { json, Response } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { createUserSupabaseClient } from "~/db/db.server";
import { getSets } from "./sets.server";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);

  const sets = await getSets(supabase);
  if (!sets.success) {
    throw sets.response;
  }

  return json({ sets: sets.data });
}


function SetCard(set: Set) {
  return <div className="flex flex-col gap-2 items-start border border-gray-600 rounded-md p-5">
    <Link to={set.id.toString()}>
      <h3 className="text-2xl">{set.name}</h3>   
    </Link>
    <p>{set.description ?? <i>No description</i>}</p>
  </div>
}

export default function Sets() {
  const { sets } = useLoaderData<typeof loader>();
  
  return (
    <div>
      {sets.map((set, i) => <SetCard key={i} {...set} />)}
    </div>
  );
}