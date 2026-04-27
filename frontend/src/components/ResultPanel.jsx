function isExpired(question) {
  if (!question || question.answer) {
    return false;
  }

  return new Date(question.expires_at).getTime() < Date.now();
}

function ResultPanel({ answer, error, loading, question, title = "Result" }) {
  let body = <p className="muted">Create a question to begin.</p>;

  if (loading) {
    body = <p className="muted">Loading...</p>;
  } else if (error) {
    body = <p className="status error">{error}</p>;
  } else if (question) {
    const resolvedAnswer = answer || question.answer;

    if (resolvedAnswer) {
      body = (
        <div className="result-stack">
          <p className="question-copy">{question.text}</p>
          <p className="status success">Final answer: {resolvedAnswer}</p>
        </div>
      );
    } else if (isExpired(question)) {
      body = (
        <div className="result-stack">
          <p className="question-copy">{question.text}</p>
          <p className="status error">This question expired.</p>
        </div>
      );
    } else {
      body = (
        <div className="result-stack">
          <p className="question-copy">{question.text}</p>
          <p className="status waiting">Waiting...</p>
        </div>
      );
    }
  }

  return (
    <aside className="card result-panel">
      <h2>{title}</h2>
      {body}
    </aside>
  );
}

export default ResultPanel;
