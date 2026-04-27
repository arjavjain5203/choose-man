function QuestionForm({ disabled, error, onChange, onSubmit, value }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Your question
        </span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          rows={4}
          maxLength={280}
          placeholder="Should I take the leap?"
          className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-lg text-ink shadow-sm outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/15"
        />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-rose-600">{error}</p>
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-coral px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {disabled ? "Generating..." : "Generate share link"}
        </button>
      </div>
    </form>
  );
}

export default QuestionForm;
