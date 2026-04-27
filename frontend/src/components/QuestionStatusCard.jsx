function QuestionStatusCard({ question }) {
  const answerLabel =
    question.answer === "yes" ? "YES" : question.answer === "no" ? "NO" : "Waiting";

  const tone =
    question.status === "answered"
      ? question.answer === "yes"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-amber-50 text-amber-700"
      : "bg-slate-100 text-slate-600";

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Current status
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-ink">{question.text}</h2>
        </div>
        <span className={`rounded-full px-4 py-2 text-sm font-semibold ${tone}`}>
          {answerLabel}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Sender
          </p>
          <p className="mt-2 break-all text-sm text-slate-700">{question.sender_id}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Receiver
          </p>
          <p className="mt-2 break-all text-sm text-slate-700">{question.receiver_id || "Not answered yet"}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            State
          </p>
          <p className="mt-2 text-sm text-slate-700">{question.status}</p>
        </div>
      </div>
    </div>
  );
}

export default QuestionStatusCard;
