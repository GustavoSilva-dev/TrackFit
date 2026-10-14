"use client";

import { useState, type FormEvent } from "react";

const workoutDivisions = [
  { value: "UPPER_BODY", label: "Upper Body" },
  { value: "LOWER_BODY", label: "Lower Body" },
  { value: "FULL_BODY", label: "Full Body" },
  { value: "PUSH", label: "Push" },
  { value: "PULL", label: "Pull" },
] as const;

function Workout() {
  const [divisao, setDivisao] = useState<(typeof workoutDivisions)[number]["value"]>(
    workoutDivisions[0].value,
  );
  const [seriesValidas, setSeriesValidas] = useState("8");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback("");
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:8080/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          divisao,
          seriesValidas: Number(seriesValidas),
        }),
      });

      if (!response.ok) {
        throw new Error(`Não foi possível registrar o treino (${response.status}).`);
      }

      setFeedback("Treino registrado com sucesso.");
      window.dispatchEvent(new Event("dashboard:refresh"));
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Ocorreu um erro ao registrar o treino.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      aria-labelledby="workout-title"
      className="w-full rounded-xl border border-slate-700 bg-[#20242d] p-4 text-white shadow-lg sm:p-5"
    >
      <h2 id="workout-title" className="mb-4 text-lg font-semibold">
        Treino do Dia 🏋️
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 flex-col justify-center items-center min-h-full">
        <div className="flex-col">
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>Divisão</span>
            <select
              required
              value={divisao}
              onChange={(event) => {
                const selectedDivision = workoutDivisions.find(
                  (division) => division.value === event.target.value,
                );

                if (selectedDivision) {
                  setDivisao(selectedDivision.value);
                }
              }}
              className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-white outline-none focus:border-yellow-300"
            >
              {workoutDivisions.map((division) => (
                <option key={division.value} value={division.value}>
                  {division.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>Séries válidas</span>
            <input
              required
              type="number"
              min="0"
              step="1"
              value={seriesValidas}
              onChange={(event) => setSeriesValidas(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-white outline-none focus:border-yellow-300"
            />
          </label>
        </div>

        {feedback && (
          <p role="status" className="text-sm text-emerald-400">
            {feedback}
          </p>
        )}
        {submitError && (
          <p role="alert" className="text-sm text-rose-400">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-yellow-300 hover:text-yellow-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Registrando..." : "+ Registrar treino"}
        </button>
      </form>
    </section>
  );
}

export default Workout;
