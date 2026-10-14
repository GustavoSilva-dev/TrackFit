"use client";

import { useState } from "react";

type HidratationProps = {
  aguaMl: number;
  metaAguaMl: number;
};

function Hidratation({ aguaMl, metaAguaMl }: HidratationProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const progress =
    metaAguaMl > 0 ? Math.min(Math.max((aguaMl / metaAguaMl) * 100, 0), 100) : 0;

  async function addWater(amount: 250 | 500) {
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8080/daily/water-${amount}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error(`Não foi possível registrar a hidratação (${response.status}).`);
      }

      window.dispatchEvent(new Event("dashboard:refresh"));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Ocorreu um erro ao registrar a hidratação.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      aria-labelledby="hydration-title"
      className="rounded-xl border border-sky-800 bg-[#173746] p-4 text-white shadow-lg"
    >
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <h2 id="hydration-title" className="font-semibold text-sky-300">
          Hidratação 💧
        </h2>
        <span className="shrink-0 text-xs text-slate-200">
          {aguaMl} / {metaAguaMl} ml
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Hidratação"
        aria-valuemin={0}
        aria-valuemax={metaAguaMl}
        aria-valuenow={Math.min(Math.max(aguaMl, 0), metaAguaMl)}
        className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-600"
      >
        <div
          className="h-full rounded-full bg-sky-400 transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => void addWater(250)}
          className="rounded-md bg-sky-400 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Registrando..." : "+250 ml"}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => void addWater(500)}
          className="rounded-md border border-sky-400 px-3 py-2 text-sm font-medium text-sky-300 transition hover:bg-sky-400/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Registrando..." : "+500 ml"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-300">
          {error}
        </p>
      )}
    </section>
  );
}

export default Hidratation;
