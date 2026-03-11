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
    <main className="min-h-screen bg-[#f7fbf7] px-6 py-12 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[28px] border border-emerald-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-emerald-700">
            Rayeva AI Systems Assignment
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Sustainable commerce workflows with simple, structured AI automation.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Module 1 auto-categorizes products into a constrained catalog taxonomy.
            Module 3 converts order composition into auditable impact reporting with AI-generated narrative layered on top.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800">
              Structured JSON outputs
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800">
              Prompt + response logging
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-800">
              MongoDB persistence
            </span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={(event) =>
              submit(event, "/api/categorize", catalogInput, setCatalogState)
            }
            className="rounded-[24px] border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-700">
                  Module 1
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  AI Auto-Category & Tag Generator
                </h2>
              </div>
              <button
                type="submit"
                disabled={catalogState.loading}
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {catalogState.loading ? "Running..." : "Run module"}
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Input is validated, sent to Groq with a constrained taxonomy prompt,
              persisted to MongoDB, and returned as structured JSON.
            </p>
            <textarea
              value={catalogInput}
              onChange={(event) => setCatalogInput(event.target.value)}
              className="mt-6 min-h-[320px] w-full rounded-2xl border border-emerald-100 bg-[#fcfffc] p-4 font-mono text-sm text-slate-800 outline-none ring-0 transition focus:border-emerald-500"
            />
            {catalogState.error ? (
              <p className="mt-4 text-sm text-rose-600">{catalogState.error}</p>
            ) : null}
            {catalogState.data ? (
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-xs text-slate-800">
                {catalogState.data}
              </pre>
            ) : null}
          </form>

          <form
            onSubmit={(event) =>
              submit(event, "/api/impact-report", impactInput, setImpactState)
            }
            className="rounded-[24px] border border-emerald-100 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-700">
                  Module 3
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  AI Impact Reporting Generator
                </h2>
              </div>
              <button
                type="submit"
                disabled={impactState.loading}
                className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {impactState.loading ? "Running..." : "Run module"}
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Plastic and carbon metrics are calculated in code, while the model
              only generates language from those verified numbers.
            </p>
            <textarea
              value={impactInput}
              onChange={(event) => setImpactInput(event.target.value)}
              className="mt-6 min-h-[320px] w-full rounded-2xl border border-emerald-100 bg-[#fcfffc] p-4 font-mono text-sm text-slate-800 outline-none ring-0 transition focus:border-emerald-500"
            />
            {impactState.error ? (
              <p className="mt-4 text-sm text-rose-600">{impactState.error}</p>
            ) : null}
            {impactState.data ? (
              <pre className="mt-4 overflow-x-auto rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-xs text-slate-800">
                {impactState.data}
              </pre>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
