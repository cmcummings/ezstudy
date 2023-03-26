import type { SetWithTerms, Term } from "~/util/types";
import { AnimatePresence, AnimationProps, wrap } from "framer-motion";
import { Link, useOutletContext } from "@remix-run/react";
import { ButtonHTMLAttributes, cloneElement, useState } from "react";
import { motion } from "framer-motion";
import { MdNavigateBefore, MdNavigateNext, MdOutlineArrowBack } from "react-icons/md";
import { Button, HorizontalDivider } from "~/components/common";
import { shuffleArray } from "~/util/util";

function NavigationButton({ icon, ...props }: { icon: JSX.Element } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props}>
      {cloneElement(icon, { className: "w-12 h-12 bg-teal-500/10 hover:bg-teal-300/30 text-teal-500 hover:text-teal-300 rounded-full" })}
    </button>
  );
}

const TRANSITION_DISTANCE = 250;

const cardVariants: AnimationProps["variants"] = {
  enter: (direction: boolean) => {
    return {
      x: direction ? -TRANSITION_DISTANCE : TRANSITION_DISTANCE,
      scale: 0.8,
      opacity: 0
    }
  },
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
  },
  centerFlipped: {
    x: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction: boolean) => {
    return {
      x: direction ? TRANSITION_DISTANCE : -TRANSITION_DISTANCE,
      scale: 0.8,
      opacity: 0
    }
  }
}

function Flashcard({ terms }: { terms: Term[] }) {
  const [[termIdxUnwrapped, direction], setTermIdx] = useState([0, true]); // The term to display and the direction it's going in
  const [side, setSide] = useState(false); // The side of the card to display

  const termIdx = wrap(0, terms.length, termIdxUnwrapped);
  const term = terms[termIdx];

  function nextTerm() {
    setTermIdx(([last, _]) => [last + 1, true]);
    setSide(false);
  }

  function prevTerm() {
    setTermIdx(([last, _]) => [last - 1, false]);
    setSide(false);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* <HorizontalDivider /> */}
      <div className="flex flex-col items-center overflow-hidden gap-3">
        <div className="relative w-[75%] lg:w-[50%] aspect-[2]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div 
              key={termIdxUnwrapped}
              className="absolute bg-gray-800 p-5 w-full h-full border border-gray-600 rounded-md hover:cursor-pointer flex justify-center items-center"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 } }}
              variants={cardVariants}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              onClick={() => setSide(!side)}>
              <h2 className="text-4xl">
                {side ? term.definition : term.term}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-row items-center gap-5">
          <NavigationButton onClick={prevTerm} icon={<MdNavigateBefore />} />
          <p className="text-2xl">{termIdx + 1} / {terms.length}</p> 
          <NavigationButton onClick={nextTerm} icon={<MdNavigateNext />} />
        </div>
      </div>
    </div>
  );
}

export default function Flashcards() {
  const set = useOutletContext<SetWithTerms>();

  const [orderedTerms, setOrderedTerms] = useState<Term[]>([...set.terms]);

  function shuffle() {
    setOrderedTerms(last => {
      const next = shuffleArray([...last]);
      return next;
    });
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
          <h1 className="text-2xl">Flashcards</h1>
        </div>
        <div>
          <Button onClick={shuffle}>Shuffle Terms</Button>
        </div>
      </div>
      <HorizontalDivider />
      <Flashcard terms={orderedTerms} />
    </div>
  );
}
