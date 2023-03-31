import type { SetWithTerms } from "~/util/types";
import { Link, useOutletContext } from "@remix-run/react";
import { MdOutlineArrowBack } from "react-icons/md";
import { HorizontalDivider } from "~/components/common";

export default function Quiz() {
  const set = useOutletContext<SetWithTerms>();

  function generate() {

  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col gap-3">
          <Link 
            to={`/sets/${set.id}`}
            className="text-gray-500 hover:text-gray-400 flex flex-row gap-1 items-center uppercase">
            <MdOutlineArrowBack /><p>Back to {set.name}</p>
          </Link>
          <h1 className="text-2xl">Quiz</h1>
        </div>
      </div>
      <HorizontalDivider />
    </div>
  );
}