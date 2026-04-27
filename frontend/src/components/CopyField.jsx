function CopyField({ label, value, onCopy }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          readOnly
          value={value}
          className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
        />
        <button
          type="button"
          onClick={() => onCopy(value)}
          className="rounded-2xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default CopyField;
