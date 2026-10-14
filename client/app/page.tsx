import { Suspense } from "react";
import Header from "../components/Header";
import Dashboard, { type DailyDashboardData } from "../components/Dashboard";
import Footer from "../components/Footer";
import Register, { type Food } from "../components/Register";
import Records from "../components/Records";
import Workout from "../components/Workout";

async function getDashboardData(): Promise<DailyDashboardData> {
    const res = await fetch("http://localhost:8080/daily/today", {
      cache: "no-store"
    })

    if (!res.ok) {
      console.log(res)
      throw new Error(`Erro ao coletar dados do dashboard: ${res.status}`);
    }

    return res.json() as Promise<DailyDashboardData>;
}

function isFood(value: unknown): value is Food {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "string" &&
    "nomeExibicao" in value &&
    typeof value.nomeExibicao === "string" &&
    "kcalPorGrama" in value &&
    typeof value.kcalPorGrama === "number" &&
    "proteinaPorGrama" in value &&
    typeof value.proteinaPorGrama === "number" &&
    "carboPorGrama" in value &&
    typeof value.carboPorGrama === "number" &&
    "gorduraPorGrama" in value &&
    typeof value.gorduraPorGrama === "number"
  );
}

async function getAlimentos(): Promise<Food[]> {
    const res = await fetch("http://localhost:8080/alimentos", {
      cache: "no-store"
    })

    if (!res.ok) {
      throw new Error(`Erro ao coletar dados dos alimentos: ${res.status}`);
    }

    const result: unknown = await res.json();

    if (
      typeof result !== "object" ||
      result === null ||
      !("content" in result) ||
      !Array.isArray(result.content) ||
      !result.content.every(isFood)
    ) {
      throw new Error("A resposta da API de alimentos está em um formato inválido.");
    }

    return result.content;
  }

function RegisterLoading() {
  return (
    <section
      aria-label="Carregando alimentos"
      aria-busy="true"
      className="min-h-[360px] w-full animate-pulse rounded-xl border border-slate-700 bg-[#20242d] p-4 shadow-lg sm:p-5"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="h-5 w-36 rounded bg-slate-700" />
        <div className="h-9 w-48 rounded-lg bg-slate-700" />
      </div>
      <div className="mb-4 h-10 rounded-md bg-slate-700" />
      <div className="space-y-2">
        <div className="h-11 rounded-md bg-slate-700" />
        <div className="h-11 rounded-md bg-slate-700" />
        <div className="h-11 rounded-md bg-slate-700" />
      </div>
      <p className="mt-4 text-sm text-slate-400">Carregando alimentos...</p>
    </section>
  );
}

async function DashboardSection() {
  const dashboardDados = await getDashboardData();
  return <Dashboard data={dashboardDados} />;
}

const alimentos = await getAlimentos();

function DashboardLoading() {
  return (
    <section
      aria-label="Carregando desempenho"
      aria-busy="true"
      className="min-h-[360px] w-full animate-pulse rounded-lg border border-slate-700 bg-[#20242d] p-4 shadow-lg"
    >
      <div className="mb-5 h-5 w-36 rounded bg-slate-700" />
      <div className="space-y-5">
        <div className="h-8 rounded bg-slate-700" />
        <div className="h-8 rounded bg-slate-700" />
        <div className="h-8 rounded bg-slate-700" />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-4rem)] bg-[#151922] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2">
            <Suspense fallback={<DashboardLoading />}>
              <DashboardSection />
            </Suspense>
            <Suspense fallback={<RegisterLoading />}>
              <Register alimentos={alimentos}/>
            </Suspense>
            <Workout />
            <Records />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
