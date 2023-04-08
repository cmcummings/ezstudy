import type { SetWithTerms, Term } from "~/util/types";
import { Link, useOutletContext } from "@remix-run/react";
import { MdOutlineArrowBack } from "react-icons/md";
import { Button, HorizontalDivider, Input } from "~/components/common";
import { useState } from "react";
import { getRandomValue, randRange, shuffleArray } from "~/util/util";

interface QuestionProps {
  term: Term,
  onCorrectChange: (isCorrect: boolean) => void
}

interface FillQuestionProps extends QuestionProps { }

const FillQuestion = ({ term, onCorrectChange }: FillQuestionProps) => {
  const [correct, setCorrect] = useState(false);

  function onChange(val: string) {
    if (val === term.term) {
      setCorrect(c => {
        if (!c) {
          onCorrectChange(true);
        }
        return true;
      })
    } else {
      setCorrect(c => {
        if (c) {
          onCorrectChange(false);
        }
        return false;
      });
    }
  }

  return (
    <div>
      <p>{term.definition}</p>
      <Input onChange={e => onChange(e.target.value)} />
    </div>
  )
}

interface MultipleChoiceQuestionProps extends QuestionProps {
  options: string[]
}

const MultipleChoiceQuestion = ({ term, options, onCorrectChange }: MultipleChoiceQuestionProps) => {
  const [correct, setCorrect] = useState(false);

  function onChange(value: string) {
    if (term.term === value) {
      setCorrect(c => {
        if (!c) {
          onCorrectChange(true);
        }
        return true;
      })
    } else {
      setCorrect(c => {
        if (c) {
          onCorrectChange(false);
        }
        return false;
      })
    }
  }

  return (
    <div>
      <p>{term.definition}</p>
      {
        options.map((option, i) => (
          <div key={i} className="flex flex-row items-center gap-2">
            <input type="radio" name={`MC-${term.id}`} value={option} onChange={e => onChange(e.target.value)} />
            <p>{option}</p>
          </div>
        ))
      }
    </div>
  )
}

const QUESTION_TYPES = ["fill", "mc"]
type QuestionBuilder = ({ type: "fill" } & FillQuestionProps) | ({ type: "mc" } & MultipleChoiceQuestionProps)


export default function Quiz() {
  const set = useOutletContext<SetWithTerms>();

  function generateMultipleChoice(correctTerm: string) {
    // Generate 3 random terms
    const terms = shuffleArray([...set.terms]);
    const options = [];
    let i = 0;
    while (options.length < 3 && i < terms.length) {
      if (terms[i].term != correctTerm) {
        options.push(terms[i].term)
      }
      i++;
    }
    // Add correctTerm in random position
    i = Math.floor(randRange(0, 3));
    const temp = options[i];
    options[i] = correctTerm;
    options.push(temp);
    return options;
  }

  function generateQuestions() {
    // Generate terms
    const terms = shuffleArray([...set.terms]);
    const qs: QuestionBuilder[] = []
    for (let i = 0; i < terms.length; i++) {
      const qType = getRandomValue(QUESTION_TYPES);
      const onCorrectChange = (correct: boolean) => setQuestionCorrect(correct)
      switch (qType) {
        case "fill":
          qs.push({
            type: "fill",
            term: terms[i],
            onCorrectChange: onCorrectChange
          });
          break;
        default:
          qs.push({
            type: "mc",
            term: terms[i],
            options: generateMultipleChoice(terms[i].term),
            onCorrectChange: onCorrectChange
          })
      }
    }
    return qs
  }

  const [result, setResult] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionBuilder[]>(generateQuestions());
  const [corrects, setCorrects] = useState<number>(0);

  function generate() {
    setQuestions(generateQuestions());
    setCorrects(0); // Initialize corrects to false
    setResult(null);
  }

  function setQuestionCorrect(correct: boolean) {
    setCorrects(cs => cs + (correct ? 1 : -1))
  }

  function showResult() {
    setResult(corrects);
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
        <div className="flex flex-col gap-2 items-end">
          <Button onClick={generate}>Re-generate</Button>
          <div className="flex flex-row gap-2 items-center">
            <p>{result !== null ? <>{result} / {questions.length} correct!</> : null}</p>
            <Button onClick={showResult}>Submit</Button>
          </div>
        </div>
      </div>
      <HorizontalDivider />
      <div className="flex flex-col gap-4">
        {questions.map(question => {
          switch (question.type) {
            case "fill":
              return (
                <FillQuestion {...question} />
              )
            case "mc":
              return (
                <MultipleChoiceQuestion {...question} />
              )
            default:
              return null
          }
        })}
      </div>
    </div>
  );
}
