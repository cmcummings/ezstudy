import { json, Response, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSetById } from "./sets.server";
import { useCatch } from "@remix-run/react";
import { errorResponse, validateZodSchema } from "~/util/util.server";
import { z } from "zod";
import { createUserSupabaseClient } from "~/db/db.server";
import { HorizontalDivider } from "~/components/common";

const setParamsSchema = z.object({
  id: z.coerce
  .number({
    invalid_type_error: "Set id must be an integer.",
    required_error: "Set id is required."
  })
  .int("Set id must be an integer.")
  .positive("Set id must be positive.")
})

export const loader = async ({ request, params }: LoaderArgs) => {
  const paramsResult = validateZodSchema(setParamsSchema, params);
  if (!paramsResult.success) {
    throw errorResponse("Invalid set id.", 400);
  }

  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);

  const setResult = await getSetById(supabase, paramsResult.data.id);
  if (!setResult.success) {
    throw setResult.response;
  }

  return json({ set: setResult.data }, { headers: response.headers });
}


function TermCard({ term, definition }: { term: string, definition: string }) {
  return <div className="flex flex-col gap-2 items-start border border-gray-600 rounded-md p-5">
    <div>
      <p className="text-gray-400">Term</p>
      <p>{term}</p>
    </div>
    <div>
      <p className="text-gray-400">Definition</p>
      <p>{definition}</p>
    </div>
  </div>
}

export default function Set() {
  const { set } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between">
        <div>
          <h1 className="text-3xl">{set.name}</h1>
          <p>{set.description ?? <i>No description.</i>}</p>
        </div>
        <div>
          <p>Created by {set.creator.username}</p>
        </div>
      </div>
      <HorizontalDivider />
      <div className="flex flex-col gap-3">
        {set.terms.map((term, i) => <TermCard key={i} {...term} />)}
      </div>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div>
      <h1>Caught</h1>
      <p>Status: {caught.status}</p>
      <pre>
        <code>{JSON.stringify(caught.data, null, 2)}</code>
      </pre>
    </div>
  );
}