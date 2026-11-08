"use client";
export default function Err({ reset }: { error: Error; reset: () => void }) {
  return <div className="card" role="alert"><h3>Une erreur est survenue · حدث خطأ</h3><button onClick={reset}>↻</button></div>;
}
