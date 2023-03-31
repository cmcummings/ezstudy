import type { SetWithTerms, Term } from "~/util/types";
import type { PostResponse } from "~/util/util.server";
import { useCatch, useFetcher, useOutletContext, useSubmit } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { cloneElement, useEffect, useRef, useState } from "react";
import { Modal, LinkButton, Button, Avatar, HorizontalDivider, Input, SubmitButton, Errors } from "~/components/common";
import { dateStringToRelativeTimeString } from "~/util/util";
import { GiCardRandom } from "react-icons/gi";
import { MdAdd, MdDelete, MdEdit, MdQuiz } from "react-icons/md";
import { useUser } from "~/user";

function TermCard({ term, editable }: { term: Term, editable: boolean }) {
  return <div className="group relative flex flex-col gap-2 items-start border border-gray-600 bg-gray-800 rounded-md p-5">
    <div>
      <p className="text-gray-400">Term</p>
      <p>{term.term}</p>
    </div>
    <div>
      <p className="text-gray-400">Definition</p>
      <p>{term.definition}</p>
    </div>
    {editable 
    ? <div className="absolute top-[3px] right-[3px] hidden group-hover:flex flex-row gap-1">
      <EditTerm term={term} />
      <DeleteTerm termId={term.id} />
    </div> 
    : null }
  </div>
}

function StudyOption({ link, label, icon }: { link: string, label: string, icon: JSX.Element }) {
  return (
    <Link to={link} className="bg-teal-800 border border-teal-600 hover:bg-teal-700 hover:border-teal-500 rounded-md p-3 flex flex-row gap-2 justify-center items-center cursor-pointer">
      {cloneElement(icon, { className: "w-8 h-8" })}
      <p className="text-xl">{label}</p>
    </Link>
  );
}

function EditSet({ set }: { set: SetWithTerms }) {
  const [modalOpen, setModalOpen] = useState(false);
  const $form = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const data: PostResponse = fetcher.data;

  const [name, setName] = useState(set.name);
  const [description, setDescription] = useState(set.description || "");
  const [isPublic, setPublic] = useState(set.public);

  useEffect(() => {
    if (fetcher.state === "loading") {
      setModalOpen(false);
    }
  }, [fetcher.state])

  return <>
    <Button className="flex flex-row gap-2 items-center" onClick={() => setModalOpen(true)}><MdEdit /> Edit</Button>
    <Modal isOpen={modalOpen}>
      <fetcher.Form 
        ref={$form}
        method="post"
        action={`/api/sets/${set.id}/update`}
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
          <SubmitButton loading={fetcher.state !== "idle"}>Save</SubmitButton>
        </div>
      </fetcher.Form>
    </Modal>
  </>
}

function NewTerm({ setId }: { setId: number }) {
  const [modalOpen, setModalOpen] = useState(false);
  const $form = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const data: PostResponse = fetcher.data;

  useEffect(() => {
    if (fetcher.state === "loading") {
      setModalOpen(false);
    }
  }, [fetcher.state])

  return <>
    <Button className="self-center flex flex-row gap-1 items-center" onClick={() => setModalOpen(true)}><MdAdd /> New Term</Button>
    <Modal isOpen={modalOpen}>
      <fetcher.Form 
        ref={$form}
        method="post"
        action={`/api/sets/${setId}/add-term`}
        className="flex flex-col gap-2">

        <label htmlFor="term">Term</label>
        <Input name="term" /> 
        <Errors errors={!data?.success ? data?.validationErrors?.fieldErrors.term : undefined} />

        <label htmlFor="definition">Definition</label>
        <Input name="definition" />
        <Errors errors={!data?.success ? data?.validationErrors?.fieldErrors.definition : undefined} />

        <div className="flex flex-row gap-2">
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <SubmitButton loading={fetcher.state !== "idle"}>Create</SubmitButton>
        </div>
      </fetcher.Form>
    </Modal>
  </>
}

function EditTerm({ term }: { term: Term }) {
  const [modalOpen, setModalOpen] = useState(false);
  const $form = useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();
  const data: PostResponse = fetcher.data;

  const [termText, setTermText] = useState(term.term);
  const [definition, setDefinition] = useState(term.definition);

  useEffect(() => {
    if (fetcher.state === "loading") {
      setModalOpen(false);
    }
  }, [fetcher.state])

  return <>
    <Button className="self-center flex flex-row gap-1 items-center" onClick={() => setModalOpen(true)}><MdEdit /> Edit</Button>
    <Modal isOpen={modalOpen}>
      <fetcher.Form 
        ref={$form}
        method="post"
        action={`/api/terms/${term.id}/update`}
        className="flex flex-col gap-2">

        <label htmlFor="term">Term</label>
        <Input name="term" value={termText} onChange={e => setTermText(e.currentTarget.value)} /> 
        <Errors errors={!data?.success ? data?.validationErrors?.fieldErrors.term : undefined} />

        <label htmlFor="definition">Definition</label>
        <Input name="definition" value={definition} onChange={e => setDefinition(e.currentTarget.value)}/>
        <Errors errors={!data?.success ? data?.validationErrors?.fieldErrors.definition : undefined} />

        <div className="flex flex-row gap-2">
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <SubmitButton loading={fetcher.state !== "idle"}>Save</SubmitButton>
        </div>
      </fetcher.Form>
    </Modal>
  </>
}

function DeleteTerm({ termId }: { termId: number }) {
  const fetcher = useFetcher();

  function deleteTerm() {
    if (confirm("Are you sure you want to delete this term?")) {
      fetcher.submit(null, { method: "post", action: `/api/terms/${termId}/delete` })
    }
  }

  return <Button onClick={deleteTerm} className="flex flex-row gap-1 items-center"><MdDelete />Delete</Button>
}

function DeleteSet({ setId }: { setId: number }) {
  const submit = useSubmit();

  function deleteSet() {
    if (confirm("Are you sure you want to delete this set?")) {
      submit(null, { method: "post", action: `/api/sets/${setId}/delete` })
    }
  }

  return <Button onClick={deleteSet} className="flex flex-row gap-1 items-center"><MdDelete />Delete</Button>
}

export default function SetPage() {
  const set = useOutletContext<SetWithTerms>();
  const user = useUser();

  const editable = set.creator.id === user?.id;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start">
          <p className="text-gray-500 uppercase">{set.public ? "Public set" : "Private set"}</p>
          <h1 className="text-3xl">{set.name}</h1>
          <p>{(!set.description || set.description === "") ? <i>No description.</i> : set.description}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <div className="flex flex-row gap-2 items-center">
            <p className="text-gray-500 uppercase">Created {dateStringToRelativeTimeString(set.createdAt)} by</p>
            <Button className="flex flex-row items-center gap-3">
              <p>{set.creator.username}</p> 
            </Button>
          </div>
          {
            editable 
            ? <div className="flex flex-row gap-1">
                <EditSet set={set} /> 
                <DeleteSet setId={set.id} />
              </div>
            : null
          }
        </div>
      </div>
      <HorizontalDivider />
      {/* <h2 className="text-2xl">Study</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <StudyOption link="flashcards" label="Flashcards" icon={<GiCardRandom />} />
        <StudyOption link="quiz" label="Quiz" icon={<MdQuiz />} />
      </div>
      <HorizontalDivider />
      <div className="flex flex-col gap-3">
        {set.terms.map((term, i) => <TermCard key={i} term={term} editable={editable} />)}
        {editable ? <NewTerm setId={set.id} /> : null}
      </div>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div className="flex flex-col justify-center items-center">
      {caught.status === 404
      ? <h1>Set is either private or does not exist.</h1>
      : <h1>An error occurred.</h1>}
    </div>
  );
}
