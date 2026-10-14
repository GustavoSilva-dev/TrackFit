"use client";

import { useEffect, useState } from "react";
import Hidratation from "./Hidratation";

export type DailyDashboardData = {
  totalKcal: number;
  metaKcal: number;
  totalProteina: number;
  metaProteina: number;
  totalCarbo: number;
  metaCarbo: number;
  totalGordura: number;
  metaGordura: number;
  aguaMl: number;
  metaAguaMl: number;
  treino: boolean | null;
};

type DashboardProps = {
  data: DailyDashboardData;
};

const numberFormatter = new Intl.NumberFormat("pt-BR");
const refreshIntervalMs = 5000;

function isDailyDashboardData(value: unknown): value is DailyDashboardData {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  const fields: (keyof DailyDashboardData)[] = [
    "totalKcal",
    "metaKcal",
    "totalProteina",
    "metaProteina",
    "totalCarbo",
    "metaCarbo",
    "totalGordura",
    "metaGordura",
    "aguaMl",
    "metaAguaMl",
  ];

  return fields.every(
    (field) =>
      typeof record[field] === "number" &&
      Number.isFinite(record[field]),
  );
}

function Dashboard({ data }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState(data);
  const [refreshError, setRefreshError] = useState("");

  useEffect(() => {
    setDashboardData(data);
  }, [data]);

  useEffect(() => {
    let controller: AbortController | undefined;

    async function refreshDashboard() {
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;

      try {
        const response = await fetch("http://localhost:8080/daily/today", {
          cache: "no-store",
          signal: requestController.signal,
        });

        if (!response.ok) {
          throw new Error(`Não foi possível atualizar o dashboard (${response.status}).`);
        }

        const result: unknown = await response.json();

        if (!isDailyDashboardData(result)) {
          throw new Error("A resposta do dashboard está em um formato inválido.");
        }

        setDashboardData(result);
        setRefreshError("");
        window.dispatchEvent(new Event("records:refresh"));
      } catch (error) {
        if (!requestController.signal.aborted) {
          setRefreshError(
            error instanceof Error
              ? error.message
              : "Ocorreu um erro ao atualizar o dashboard.",
          );
        }
      }
    }

    window.addEventListener("dashboard:refresh", refreshDashboard);
    void refreshDashboard();
    const intervalId = window.setInterval(
      () => void refreshDashboard(),
      refreshIntervalMs,
    );

    return () => {
      window.clearInterval(intervalId);
      controller?.abort();
      window.removeEventListener("dashboard:refresh", refreshDashboard);
    };
  }, []);

  const metrics = [
    {
      label: "Energia (Calorias)",
      current: dashboardData.totalKcal,
      goal: dashboardData.metaKcal,
      unit: "kcal",
    },
    {
      label: "Construtores (Proteínas)",
      current: dashboardData.totalProteina,
      goal: dashboardData.metaProteina,
      unit: "g",
    },
    {
      label: "Combustível (Carboidratos)",
      current: dashboardData.totalCarbo,
      goal: dashboardData.metaCarbo,
      unit: "g",
    },
    {
      label: "Gorduras",
      current: dashboardData.totalGordura,
      goal: dashboardData.metaGordura,
      unit: "g",
    },
  ];

  return (
    <section
      aria-labelledby="dashboard-title"
      className="flex min-h-90 w-full flex-col rounded-xl border border-slate-700 bg-[#20242d] p-4 text-white shadow-lg sm:p-5"
    >
      <h1 id="dashboard-title" className="mb-3 text-base font-semibold">
        Seu Desempenho
      </h1>

      {refreshError && (
        <p role="alert" className="mb-3 text-sm text-red-300">
          {refreshError}
        </p>
      )}

      <div
        role="status"
        aria-live="polite"
        className={`mb-3 rounded-lg border px-3 py-2 text-sm font-medium ${
          dashboardData.treino
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/50 bg-amber-500/10 text-amber-300"
        }`}
      >
        {dashboardData.treino
          ? "Treino diário efetuado hoje"
          : "Treino diário ainda não efetuado"}
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-3">
        {metrics.map(({ label, current, goal, unit }) => {
          const progress =
            goal > 0 ? Math.min(Math.max((current / goal) * 100, 0), 100) : 0;

          return (
            <div key={label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <span>{label}</span>
                <span className="shrink-0 text-slate-300">
                  {numberFormatter.format(current)} / {numberFormatter.format(goal)} {unit}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={goal}
                aria-valuenow={Math.min(Math.max(current, 0), goal)}
                className="h-5 overflow-hidden rounded-lg bg-slate-600"
              >
                <div
                  className="h-full rounded-full bg-yellow-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
        <Hidratation
          aguaMl={dashboardData.aguaMl}
          metaAguaMl={dashboardData.metaAguaMl}
        />
      </div>
    </section>
  );
}

export default Dashboard;