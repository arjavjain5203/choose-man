import { useEffect, useState } from "react";
import DecisionButtons from "../components/DecisionButtons";
import ModeSelector from "../components/ModeSelector";
import QuestionInput from "../components/QuestionInput";
import ResultPanel from "../components/ResultPanel";
import ShareLink from "../components/ShareLink";
import { answerQuestion, createQuestion, getQuestion } from "../services/api";
import { connect } from "../services/socket";
import { getAnonymousUserId } from "../utils/user";

function Home() {
  const [mode, setMode] = useState("fixed");
  const [questionText, setQuestionText] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [question, setQuestion] = useState(null);
  const [result, setResult] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState("");
  const [userId] = useState(() => getAnonymousUserId());

  useEffect(() => {
    const socketConnection = connect(userId, async (message) => {
      if (message.type !== "answer" || message.question_id !== questionId) {
        return;
      }

      setResult(message.answer);
      try {
        const latestQuestion = await getQuestion(message.question_id);
        setQuestion(latestQuestion);
      } catch (socketError) {
        setError(socketError.message);
      }
    });

    return () => {
      socketConnection.close();
    };
  }, [questionId, userId]);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await createQuestion(questionText, mode, userId);
      const createdQuestion = await getQuestion(response.question_id);
      setQuestionId(response.question_id);
      setQuestion(createdQuestion);
      setShareLink(`${window.location.origin}/answer/${response.question_id}`);
    } catch (createError) {
      setError(createError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedValue) => {
    if (!questionId) {
      setError("Create a question before answering.");
      return;
    }

    setAnswering(true);
    setError("");

    try {
      const activeMode = question?.mode || mode;
      const response =
        activeMode === "fixed"
          ? await answerQuestion(questionId, userId, selectedValue)
          : await answerQuestion(questionId, userId);

      setResult(response.answer);
      const latestQuestion = await getQuestion(questionId);
      setQuestion(latestQuestion);
    } catch (answerError) {
      setError(answerError.message);
      if (questionId) {
        try {
          const latestQuestion = await getQuestion(questionId);
          setQuestion(latestQuestion);
        } catch (fetchError) {
          setError(fetchError.message);
        }
      }
    } finally {
      setAnswering(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-grid">
        <section className="content-column">
          <header className="page-header">
            <p className="eyebrow">Anonymous decisions</p>
            <h1>Ask a question, answer it yourself, or share it for someone else.</h1>
          </header>
          <ModeSelector mode={mode} onChange={setMode} />
          <QuestionInput
            value={questionText}
            onChange={setQuestionText}
            onSubmit={handleCreate}
            disabled={loading}
          />
          <ShareLink link={shareLink} />
          <DecisionButtons
            disabled={!questionId || answering}
            mode={question?.mode || mode}
            onSelect={handleAnswer}
          />
        </section>

        <ResultPanel answer={result} error={error} loading={loading} question={question} title="Live result" />
      </div>
    </div>
  );
}

export default Home;
