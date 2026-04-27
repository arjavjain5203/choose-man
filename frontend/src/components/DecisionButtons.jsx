function DecisionButtons({ disabled, mode, onSelect }) {
  const isRandom = mode === "random";

  return (
    <div className="card">
      <h2>Answer</h2>
      <p className="muted">
        {isRandom
          ? "Click to let the system decide randomly."
          : "Choose the final answer."}
      </p>

      <div className="button-row">
        <button
          className="decision-button yes"
          type="button"
          disabled={disabled}
          onClick={() => onSelect(isRandom ? null : "YES")}
        >
          {isRandom ? "OPTION" : "YES"}
        </button>

        <button
          className="decision-button no"
          type="button"
          disabled={disabled}
          onClick={() => onSelect(isRandom ? null : "NO")}
        >
          {isRandom ? "OPTION" : "NO"}
        </button>
      </div>
    </div>
  );
}

export default DecisionButtons;