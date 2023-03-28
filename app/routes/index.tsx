import { LinkButton } from "~/components/common";

export default function Index() {
  return (
    <div className="flex flex-col items-start gap-3 mt-52">
      <div>
        <h1 className="text-6xl"><span className="text-teal-500">EZ</span>STUDY</h1>
        <p>Easily make flashcards and quizzes for anything.</p>
      </div>
      <LinkButton to="/register">Start studying</LinkButton>
    </div>
  );
}
