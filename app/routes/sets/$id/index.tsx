import type { SetWithTerms } from "~/util/types";
import { useOutletContext } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { cloneElement } from "react";
import { Avatar, HorizontalDivider } from "~/components/common";
import { dateStringToRelativeTimeString } from "~/util/util";
import { GiCardRandom } from "react-icons/gi";
import { MdQuiz } from "react-icons/md";

function TermCard({ term, definition }: { term: string, definition: string }) {
  return <div className="flex flex-col gap-2 items-start border border-gray-600 bg-gray-800 rounded-md p-5">
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

function StudyOption({ link, label, icon }: { link: string, label: string, icon: JSX.Element }) {
  return (
    <Link to={link} className="bg-teal-800 border border-teal-600 hover:bg-teal-700 hover:border-teal-500 rounded-md p-3 flex flex-row gap-2 items-center cursor-pointer">
      {cloneElement(icon, { className: "w-8 h-8" })}
      <p className="text-xl">{label}</p>
    </Link>
  );
}

export default function SetPage() {
  const set = useOutletContext<SetWithTerms>();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl">{set.name}</h1>
          <p>{set.description ?? <i>No description.</i>}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex flex-row gap-2 items-center">
            <p>Created by {set.creator.username}</p>
            <Avatar src={set.creator.avatarUrl} />
          </div>
          <p>{dateStringToRelativeTimeString(set.createdAt)}</p>
          </div>
      </div>
      <HorizontalDivider />
      {/* <h2 className="text-2xl">Study</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <StudyOption link="flashcards" label="Flashcards" icon={<GiCardRandom />} />
        <StudyOption link="quiz" label="Quiz" icon={<MdQuiz />} />
      </div>
      <HorizontalDivider />
      <div className="flex flex-col gap-3">
        {set.terms.map((term, i) => <TermCard key={i} {...term} />)}
      </div>
    </div>
  )
}

export function CatchBoundary() {
  // const caught = useCatch();

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Set could not be found.</h1>
    </div>
  );
}
