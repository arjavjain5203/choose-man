function AnswerButtons({ disabled, onAnswer }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onAnswer("yes")}
        disabled={disabled}
        className="rounded-3xl bg-teal px-6 py-4 text-lg font-semibold text-white shadow-glow transition hover:-translate-y-1 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        YES
      </button>
      <button
        type="button"
        onClick={() => onAnswer("no")}
        disabled={disabled}
        className="rounded-3xl bg-gold px-6 py-4 text-lg font-semibold text-white shadow-glow transition hover:-translate-y-1 hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        NO
      </button>
    </div>
  );
}

export default AnswerButtons;
