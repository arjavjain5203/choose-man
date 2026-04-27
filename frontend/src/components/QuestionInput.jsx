function QuestionInput({ value, onChange, onSubmit, disabled }) {
  const hasQuestion = value.trim().length > 0;

  const handleSubmit = () => {
    if (!hasQuestion || disabled) {
      return;
    }

    onSubmit();
  };

  return (
    <div className="card">
      <h2>Ask a question</h2>
      <textarea
        className="question-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Should I take the leap?"
        rows={4}
        disabled={disabled}
      />
      <button className="primary-button" type="button" onClick={handleSubmit} disabled={disabled || !hasQuestion}>
        {disabled ? "Creating..." : "Create question"}
      </button>
    </div>
  );
}

export default QuestionInput;
