"use client";

import { FormEvent, useState } from "react";

const sampleCatalogPayload = {
  name: "Compostable Sugarcane Meal Tray",
  description:
    "A molded fiber tray for takeaway meals made from upcycled sugarcane bagasse, suitable for hot food and leak resistant for sauces.",
  materials: ["bagasse", "water-based coating"],
  targetAudience: "B2B food service buyers",
};

const sampleImpactPayload = {
  orderId: "RV-10042",
  customerName: "Green Basket Cafe",
  items: [
    {
      productName: "Bagasse Food Tray",
      category: "Food Service",
      quantityKg: 42,
      isLocallySourced: true,
      packaging: "compostable",
    },
    {
      productName: "Recycled Tissue Box",
      category: "Hospitality Supplies",
      quantityKg: 18,
      isLocallySourced: false,
      packaging: "recycled",
    },
  ],
};

type ApiState = {
  loading: boolean;
  error: string | null;
  data: string;
};

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export default function Dashboard() {
  const [catalogInput, setCatalogInput] = useState(pretty(sampleCatalogPayload));
  const [impactInput, setImpactInput] = useState(pretty(sampleImpactPayload));
  const [catalogState, setCatalogState] = useState<ApiState>({
    loading: false,
    error: null,
    data: "",
  });
  const [impactState, setImpactState] = useState<ApiState>({
    loading: false,
    error: null,
    data: "",
  });

  async function submit(
    event: FormEvent,
    url: string,
    rawInput: string,
    setState: (state: ApiState) => void
  ) {
    event.preventDefault();
    setState({ loading: true, error: null, data: "" });

    try {
      const body = JSON.parse(rawInput);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Request failed");
      }

      setState({ loading: false, error: null, data: pretty(result) });
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error.message : "Unknown request error",
        data: "",
      });
    }
  }

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-stone-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[32px] border border-emerald-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.22),_transparent_35%),linear-gradient(135deg,_rgba(12,10,9,0.98),_rgba(28,25,23,0.95))] p-8 shadow-2xl shadow-emerald-950/30">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">
            Rayeva AI Systems Assignment
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-stone-50 md:text-6xl">
            Sustainable commerce workflows with Groq-backed AI and deterministic business logic.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-stone-300 md:text-lg">
            Module 1 auto-categorizes products into a constrained catalog taxonomy.
            Module 3 converts order composition into auditable impact reporting with AI-generated narrative layered on top.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200">
              Structured JSON outputs
            </span>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-200">
              Prompt + response logging
            </span>
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-amber-100">
              MongoDB persistence
            </span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={(event) =>
              submit(event, "/api/categorize", catalogInput, setCatalogState)
            }
            className="rounded-[28px] border border-stone-800 bg-stone-900/80 p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
                  Module 1
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-50">
                  AI Auto-Category & Tag Generator
                </h2>
              </div>
              <button
                type="submit"
                disabled={catalogState.loading}
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-medium text-stone-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {catalogState.loading ? "Running..." : "Run module"}
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-400">
              Input is validated, sent to Groq with a constrained taxonomy prompt,
              persisted to MongoDB, and returned as structured JSON.
            </p>
            <textarea
              value={catalogInput}
              onChange={(event) => setCatalogInput(event.target.value)}
              className="mt-6 min-h-[320px] w-full rounded-2xl border border-stone-700 bg-stone-950/70 p-4 font-mono text-sm text-stone-200 outline-none ring-0 transition focus:border-emerald-400"
            />
            {catalogState.error ? (
              <p className="mt-4 text-sm text-rose-300">{catalogState.error}</p>
            ) : null}
            {catalogState.data ? (
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950 p-4 text-xs text-stone-200">
                {catalogState.data}
              </pre>
            ) : null}
          </form>

          <form
            onSubmit={(event) =>
              submit(event, "/api/impact-report", impactInput, setImpactState)
            }
            className="rounded-[28px] border border-stone-800 bg-stone-900/80 p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                  Module 3
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-50">
                  AI Impact Reporting Generator
                </h2>
              </div>
              <button
                type="submit"
                disabled={impactState.loading}
                className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-medium text-stone-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {impactState.loading ? "Running..." : "Run module"}
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-stone-400">
              Plastic and carbon metrics are calculated in code, while the model
              only generates language from those verified numbers.
            </p>
            <textarea
              value={impactInput}
              onChange={(event) => setImpactInput(event.target.value)}
              className="mt-6 min-h-[320px] w-full rounded-2xl border border-stone-700 bg-stone-950/70 p-4 font-mono text-sm text-stone-200 outline-none ring-0 transition focus:border-cyan-400"
            />
            {impactState.error ? (
              <p className="mt-4 text-sm text-rose-300">{impactState.error}</p>
            ) : null}
            {impactState.data ? (
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-stone-800 bg-stone-950 p-4 text-xs text-stone-200">
                {impactState.data}
              </pre>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
