"use client";

import { useEffect, useState, type FormEvent } from "react";

export type Food = {
  id: string;
  nomeExibicao: string;
  kcalPorGrama: number;
  proteinaPorGrama: number;
  carboPorGrama: number;
  gorduraPorGrama: number;
};

type RegisterProps = {
  alimentos: Food[];
};

type FoodTab = "base" | "coringa";

const numberFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

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

function Register({ alimentos }: RegisterProps) {
  const [activeTab, setActiveTab] = useState<FoodTab>("coringa");
  const [foodOptions, setFoodOptions] = useState(alimentos);
  const [baseFoodsRefresh, setBaseFoodsRefresh] = useState(0);
  const [isLoadingFoods, setIsLoadingFoods] = useState(false);
  const [foodsError, setFoodsError] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState(alimentos[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [peso, setPeso] = useState("150");
  const [nome, setNome] = useState("");
  const [proteinas, setProteinas] = useState("");
  const [gorduras, setGorduras] = useState("");
  const [carboidratos, setCarboidratos] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingFood, setIsAddingFood] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [foodFeedback, setFoodFeedback] = useState("");
  const [foodSubmitError, setFoodSubmitError] = useState("");

  useEffect(() => {
    if (baseFoodsRefresh === 0) {
      return;
    }

    const controller = new AbortController();

    async function refreshFoods() {
      setIsLoadingFoods(true);
      setFoodsError("");

      try {
        const response = await fetch("http://localhost:8080/alimentos", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Não foi possível atualizar os alimentos (${response.status}).`);
        }

        const result: unknown = await response.json();

        if (
          typeof result !== "object" ||
          result === null ||
          !("content" in result) ||
          !Array.isArray(result.content) ||
          !result.content.every(isFood)
        ) {
          throw new Error("A resposta da API de alimentos está em um formato inválido.");
        }

        setFoodOptions(result.content);
      } catch (error) {
        if (!controller.signal.aborted) {
          setFoodsError(
            error instanceof Error
              ? error.message
              : "Ocorreu um erro ao atualizar os alimentos.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingFoods(false);
        }
      }
    }

    void refreshFoods();

    return () => controller.abort();
  }, [baseFoodsRefresh]);

  const selectedFood = foodOptions.find((alimento) => alimento.id === selectedFoodId);
  const pesoGramas = Number(peso) || 0;
  const filteredFoods = foodOptions.filter((alimento) =>
    alimento.nomeExibicao.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")),
  );

  async function handleCoringaSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback("");
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:8080/food/coringa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          gramas: Number(peso),
          proteinas: Number(proteinas),
          gorduras: Number(gorduras),
          carboidratos: Number(carboidratos),
        }),
      });

      if (!response.ok) {
        throw new Error(`Não foi possível registrar o alimento (${response.status}).`);
      }

      setFeedback("Refeição coringa registrada com sucesso.");
      window.dispatchEvent(new Event("dashboard:refresh"));
      setNome("");
      setProteinas("");
      setGorduras("");
      setCarboidratos("");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Ocorreu um erro ao registrar o alimento.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddFood() {
    if (!selectedFood || pesoGramas <= 0) {
      return;
    }

    setIsAddingFood(true);
    setFoodFeedback("");
    setFoodSubmitError("");

    try {
      const response = await fetch("http://localhost:8080/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alimento: selectedFood.nomeExibicao,
          gramas: pesoGramas,
        }),
      });

      if (!response.ok) {
        throw new Error(`Não foi possível adicionar o alimento (${response.status}).`);
      }

      setFoodFeedback(`${selectedFood.nomeExibicao} adicionado à contagem diária.`);
      window.dispatchEvent(new Event("dashboard:refresh"));
    } catch (error) {
      setFoodSubmitError(
        error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o alimento.",
      );
    } finally {
      setIsAddingFood(false);
    }
  }

  return (
    <section
      aria-labelledby="register-title"
      className="min-h-[360px] w-full rounded-xl border border-slate-700 bg-[#20242d] p-4 text-white shadow-lg sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="register-title" className="text-lg font-semibold">
          Registrar refeição
        </h2>

        <div
          aria-label="Tipo de alimento"
          className="flex rounded-lg border border-slate-700 bg-[#191d25] p-1"
          role="tablist"
        >
          <button
            id="base-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "base"}
            aria-controls="base-panel"
            onClick={() => {
              setActiveTab("base");
              setBaseFoodsRefresh((refresh) => refresh + 1);
            }}
            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
              activeTab === "base"
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Alimentos Base
          </button>
          <button
            id="coringa-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "coringa"}
            aria-controls="coringa-panel"
            onClick={() => setActiveTab("coringa")}
            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors sm:text-sm ${
              activeTab === "coringa"
                ? "border border-yellow-300 text-yellow-200"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Refeição Coringa
          </button>
        </div>
      </div>

      {activeTab === "coringa" ? (
        <form
          id="coringa-panel"
          role="tabpanel"
          aria-labelledby="coringa-tab"
          onSubmit={handleCoringaSubmit}
          className="space-y-4 mt-10 flex-col h-full"
        >
          <label className="block text-sm text-slate-300">
            <span>Nome do alimento</span>
            <input
              required
              maxLength={120}
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Ex.: Hambúrguer caseiro"
              className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-yellow-300"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Peso em Gramas</span>
              <input
                required
                type="number"
                min="1"
                step="any"
                value={peso}
                onChange={(event) => setPeso(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-300"
              />
            </label>
            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Proteínas (g)</span>
              <input
                required
                type="number"
                min="0"
                step="any"
                value={proteinas}
                onChange={(event) => setProteinas(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-300"
              />
            </label>
            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Gorduras (g)</span>
              <input
                required
                type="number"
                min="0"
                step="any"
                value={gorduras}
                onChange={(event) => setGorduras(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-300"
              />
            </label>
            <label className="space-y-1.5 text-sm text-slate-300">
              <span>Carboidratos (g)</span>
              <input
                required
                type="number"
                min="0"
                step="any"
                value={carboidratos}
                onChange={(event) => setCarboidratos(event.target.value)}
                className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-300"
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
            className="w-full rounded-md bg-yellow-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving ? "Registrando..." : "Registrar alimento"}
          </button>
        </form>
      ) : (
        <div
          id="base-panel"
          role="tabpanel"
          aria-labelledby="base-tab"
          className="space-y-4"
        >
          {foodsError && (
            <p role="alert" className="text-sm text-rose-400">
              {foodsError}
            </p>
          )}

          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>Buscar alimento</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Digite o nome de um alimento"
              className="w-full rounded-md border border-slate-700 bg-[#151922] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-yellow-300"
            />
          </label>

          {filteredFoods.length > 0 ? (
            <ul className="max-h-30 space-y-2 overflow-y-auto pr-1">
              {filteredFoods.map((alimento) => (
                <li key={alimento.id}>
                  <button
                    type="button"
                    aria-pressed={selectedFoodId === alimento.id}
                    onClick={() => setSelectedFoodId(alimento.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left transition ${
                      selectedFoodId === alimento.id
                        ? "border-yellow-300 bg-yellow-300/10"
                        : "border-slate-700 bg-[#191d25] hover:border-slate-500"
                    }`}
                  >
                    <span className="text-sm font-medium">{alimento.nomeExibicao}</span>
                    <span className="shrink-0 text-xs text-slate-400">
                      {numberFormatter.format(alimento.kcalPorGrama * 100)} kcal / 100 g
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-slate-700 bg-[#191d25] px-3 py-4 text-sm text-slate-400">
              Nenhum alimento encontrado.
            </p>
          )}

          {selectedFood && (
            <div className="rounded-md border border-slate-700 bg-[#191d25] p-3">
              <label className="flex items-center justify-between gap-3 text-sm text-slate-300">
                <span>Porção (g)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={peso}
                  onChange={(event) => setPeso(event.target.value)}
                  className="w-28 rounded-md border border-slate-700 bg-[#151922] px-3 py-2 text-right text-white outline-none focus:border-yellow-300"
                />
              </label>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300 sm:grid-cols-4">
                <div>
                  <dt className="text-slate-500">Calorias</dt>
                  <dd>{numberFormatter.format(selectedFood.kcalPorGrama * pesoGramas)} kcal</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Proteínas</dt>
                  <dd>{numberFormatter.format(selectedFood.proteinaPorGrama * pesoGramas)} g</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Carboidratos</dt>
                  <dd>{numberFormatter.format(selectedFood.carboPorGrama * pesoGramas)} g</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Gorduras</dt>
                  <dd>{numberFormatter.format(selectedFood.gorduraPorGrama * pesoGramas)} g</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div aria-live="polite">
                  {foodFeedback && (
                    <p role="status" className="text-sm text-emerald-400">
                      {foodFeedback}
                    </p>
                  )}
                  {foodSubmitError && (
                    <p role="alert" className="text-sm text-rose-400">
                      {foodSubmitError}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={isAddingFood || pesoGramas <= 0}
                  onClick={() => void handleAddFood()}
                  className="rounded-md bg-yellow-300 px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAddingFood ? "ADICIONANDO..." : "ADICIONAR"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Register;
