function DecisionButtons({ disabled, mode, onSelect }) {
  return (
    <div className="card">
      <h2>Answer</h2>
      <p className="muted">
        {mode === "fixed"
          ? "Choose the final answer."
          : "Click either button to let the backend generate a random result."}
      </p>
      <div className="button-row">
        <button
          className="decision-button yes"
          type="button"
          disabled={disabled}
          onClick={() => onSelect("YES")}
        >
          YES
        </button>
        <button
          className="decision-button no"
          type="button"
          disabled={disabled}
          onClick={() => onSelect("NO")}
        >
          NO
        </button>
      </div>
    </div>
  );
}

export default DecisionButtons;
