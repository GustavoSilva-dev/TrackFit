"use client";

import { useEffect, useState } from "react";

type DailyRecord = {
  id: string;
  date: Date;
  totalKcal: number;
  totalProteina: number;
  totalGordura: number;
  totalCarbo: number;
  treino: boolean | unknown;
};

function getDailyRecords(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "content" in value &&
    Array.isArray(value.content)
  ) {
    return value.content;
  }

  throw new Error("A resposta do histórico diário está em um formato inválido.");
}

function parseDailyRecord(value: unknown, index: number): DailyRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Um registro diário está em um formato inválido.");
  }

  const record = value as Record<string, unknown>;
  const dateValue = record.dataRegistro;
  let date: Date;

  if (typeof dateValue !== "string" || Number.isNaN(Date.parse(dateValue))) {
    throw new Error("Um registro diário possui uma data inválida.");
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [year, month, day] = dateValue.split("-").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateValue);
  }

  const { totalKcal, totalProteina, totalGordura, totalCarbo, treino } = record;

  if (
    typeof totalKcal !== "number" ||
    !Number.isFinite(totalKcal) ||
    typeof totalProteina !== "number" ||
    !Number.isFinite(totalProteina) ||
    typeof totalGordura !== "number" ||
    !Number.isFinite(totalGordura) ||
    typeof totalCarbo !== "number" ||
    !Number.isFinite(totalCarbo)
  ) {
    throw new Error("Um registro diário possui valores nutricionais inválidos.");
  }

  return {
    id: `${dateValue}-${index}`,
    date,
    totalKcal,
    totalProteina,
    totalGordura,
    totalCarbo,
    treino,
  };
}

function isToday(date: Date, now: Date): boolean {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

function Records() {
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    let isActive = true;
    let controller: AbortController | undefined;
    setToday(new Date());

    async function loadRecords() {
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:8080/daily", {
          cache: "no-store",
          signal: requestController.signal,
        });

        if (!response.ok) {
          throw new Error(`Não foi possível carregar os dias registrados (${response.status}).`);
        }

        const result: unknown = await response.json();
        const dailyRecords = getDailyRecords(result)
          .map(parseDailyRecord)
          .sort((first, second) => second.date.getTime() - first.date.getTime());

        if (isActive && controller === requestController) {
          setRecords(dailyRecords);
        }
      } catch (loadError) {
        if (isActive && !requestController.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Ocorreu um erro ao carregar os dias registrados.",
          );
        }
      } finally {
        if (isActive && controller === requestController) {
          setIsLoading(false);
        }
      }
    }

    function handleRefresh() {
      void loadRecords();
    }

    window.addEventListener("records:refresh", handleRefresh);
    void loadRecords();

    return () => {
      isActive = false;
      controller?.abort();
      window.removeEventListener("records:refresh", handleRefresh);
    };
  }, []);

  return (
    <section
      aria-labelledby="records-title"
      className="w-full rounded-xl border border-slate-700 bg-[#20242d] p-4 text-white shadow-lg sm:p-5"
    >
      <h2 id="records-title" className="mb-3 text-base font-semibold">
        Histórico de Dias
      </h2>

      {isLoading && records.length === 0 && (
        <p role="status" className="text-sm text-slate-400">
          Carregando histórico...
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      )}
      {!isLoading && !error && records.length === 0 && (
        <p className="text-sm text-slate-400">Nenhum dia registrado.</p>
      )}

      {records.length > 0 && (
        <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {records.map((record) => {
            const todayRecord = today !== null && isToday(record.date, today);

            return (
              <li
                key={record.id}
                className={`rounded-lg border p-3 ${
                  todayRecord
                    ? "border-yellow-300 bg-yellow-300/10"
                    : "border-slate-700 bg-[#191d25]"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <time
                    dateTime={record.date.toISOString()}
                    className={`text-sm font-semibold ${
                      todayRecord ? "text-yellow-200" : "text-slate-200"
                    }`}
                  >
                    {dateFormatter.format(record.date)}
                  </time>
                  {todayRecord && (
                    <span className="rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-bold text-slate-900">
                      HOJE
                    </span>
                  )}
                </div>

                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-300 sm:grid-cols-4">
                  <div>
                    <dt className="text-slate-500">Calorias</dt>
                    <dd>{numberFormatter.format(record.totalKcal)} kcal</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Proteínas</dt>
                    <dd>{numberFormatter.format(record.totalProteina)} g</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Gorduras</dt>
                    <dd>{numberFormatter.format(record.totalGordura)} g</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Carboidratos</dt>
                    <dd>{numberFormatter.format(record.totalCarbo)} g</dd>
                  </div>
                </dl>

                <p
                  className={`mt-2 text-xs font-medium ${
                    record.treino ? "text-emerald-300" : "text-slate-400"
                  }`}
                >
                  {record.treino ? "Treino realizado" : "Sem treino"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default Records;
