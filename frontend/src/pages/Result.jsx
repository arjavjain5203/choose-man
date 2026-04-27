import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ResultPanel from "../components/ResultPanel";
import { getQuestion } from "../services/api";

function Result() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadQuestion() {
      setLoading(true);
      try {
        const response = await getQuestion(id);
        if (isMounted) {
          setQuestion(response);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadQuestion();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="page-shell">
      <div className="single-column">
        <header className="page-header">
          <p className="eyebrow">Result</p>
          <h1>See the final answer</h1>
        </header>
        <ResultPanel answer={question?.answer} error={error} loading={loading} question={question} title="Answer state" />
        <Link className="secondary-link" to="/">
          Create another question
        </Link>
      </div>
    </div>
  );
}

export default Result;
