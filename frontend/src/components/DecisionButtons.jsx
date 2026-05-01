function DecisionButtons({ disabled, mode, onSelect }) {
  const isRandom = mode === "random";
  const firstChoice = isRandom ? "A" : "YES";
  const secondChoice = isRandom ? "B" : "NO";

  return (
    <div className="card">
      <h2>Answer</h2>
      <p className="muted">
        {isRandom
          ? "Choose A or B to reveal the stored result."
          : "Choose the final answer."}
      </p>

      <div className="button-row">
        <button
          className="decision-button yes"
          type="button"
          disabled={disabled}
          onClick={() => onSelect(firstChoice)}
        >
          {firstChoice}
        </button>

        <button
          className="decision-button no"
          type="button"
          disabled={disabled}
          onClick={() => onSelect(secondChoice)}
        >
          {secondChoice}
        </button>
      </div>
    </div>
  );
}

export default DecisionButtons;
