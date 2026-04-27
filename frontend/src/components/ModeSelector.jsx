function ModeSelector({ mode, onChange }) {
  return (
    <div className="card">
      <h2>Choose a mode</h2>
      <div className="mode-selector">
        <label className={mode === "fixed" ? "mode-option active" : "mode-option"}>
          <input
            type="radio"
            name="mode"
            value="fixed"
            checked={mode === "fixed"}
            onChange={() => onChange("fixed")}
          />
          <span>Fixed</span>
        </label>
        <label className={mode === "random" ? "mode-option active" : "mode-option"}>
          <input
            type="radio"
            name="mode"
            value="random"
            checked={mode === "random"}
            onChange={() => onChange("random")}
          />
          <span>Random</span>
        </label>
      </div>
      <p className="muted">
        Fixed mode uses the selected answer. Random mode ignores the clicked option and lets the backend decide.
      </p>
    </div>
  );
}

export default ModeSelector;
