function LoadingState({ label = "Loading..." }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500">
      {label}
    </div>
  );
}

export default LoadingState;
