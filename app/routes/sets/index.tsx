import type { LoaderArgs } from "@remix-run/node";
import type { Set } from "~/util/types";
import type { PostResponse } from "~/util/util.server";
import { redirect } from "@remix-run/node";
import { json, Response } from "@remix-run/node";
import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { createUserSupabaseClient } from "~/db/db.server";
import { getSetsByCreatorId } from "./sets.server";
import { SubmitButton, Button, Errors, HorizontalDivider, Input, Modal } from "~/components/common";
import { useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();

  const supabase = createUserSupabaseClient(request, response);
  
  const userResult = await supabase.auth.getUser();
  const user = userResult.data.user;
  if (userResult.error || !user) {
    return redirect("/login");
  }

  const sets = await getSetsByCreatorId(supabase, user.id);
  if (!sets.success) {
    throw sets.response;
  }

  return json({ sets: sets.data });
}


function SetCard(set: Set) {
  return (
    <Link to={set.id.toString()} className="flex flex-col gap-2 items-start border border-gray-600 bg-gray-800 hover:bg-gray-700 hover:border-gray-500 rounded-md p-5">
      <h3 className="text-2xl">{set.name}</h3>   
      <p>{set.description ?? <i>No description</i>}</p>
    </Link>
  );
}

function NewSet() {
  const [modalOpen, setModalOpen] = useState(false);
  const $form = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const data: PostResponse = fetcher.data;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setPublic] = useState(false);

  useEffect(() => {
    if (fetcher.state === "loading") {
      setModalOpen(false);
    }
  }, [fetcher.state])

  return <>
    <Button className="flex flex-row gap-2 items-center" onClick={() => setModalOpen(true)}><MdAdd /> New Set</Button>
    <Modal isOpen={modalOpen}>
      <fetcher.Form 
        ref={$form}
        method="post"
        action={`/api/sets/new`}
        className="flex flex-col gap-2">

        <label htmlFor="name">Name</label>
        <Input name="name" value={name} onChange={e => setName(e.currentTarget.value)}/> 
        <Errors errors={!data?.success ? data?.validationErrors?.fieldErrors.name : undefined} />

        <label htmlFor="description">Description</label>
        <Input name="description" value={description} onChange={e => setDescription(e.currentTarget.value)} />
        <Errors errors={!data?.success ? data?.validationErrors?.fieldErrors.description : undefined} />

        <div className="flex flex-row gap-2 items-center">
          <p>Public</p>
          <input name="public" type="checkbox" checked={isPublic} onChange={e => setPublic(e.currentTarget.checked)} />
        </div>

        <div className="flex flex-row gap-2">
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <SubmitButton loading={fetcher.state !== "idle"}>Create</SubmitButton>
        </div>
      </fetcher.Form>
    </Modal>
  </>
}

export default function Sets() {
  const { sets } = useLoaderData<typeof loader>();
  
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-end">
        <h1 className="text-3xl">Your Sets</h1>
        <NewSet />
      </div>
      <HorizontalDivider />
      <div className="grid grid-cols-2 gap-2">
        {sets.map((set, i) => <SetCard key={i} {...set} />)}
      </div>
    </div>
  );
}