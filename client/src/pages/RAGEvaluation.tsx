import React from "react";
import { evaluateRAGEnginePerformance } from "@/lib/rag-evaluation-engine";
import { getDatasetInspectionReports } from "@/lib/dataset-provenance-inspector";
import { FileText, Search, Clock, ShieldCheck, Database, AlertCircle, CheckCircle2, Zap } from "lucide-react";

function MetricTile({ title, score, status, description }: {
  title: string;
  score: string;
  status: "OPTIMAL" | "ACCEPTABLE" | "NEEDS_IMPROVEMENT";
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-slate-400">{title}</span>
        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-0.5 text-[10px] font-black">
          {status}
        </span>
      </div>
      <p className="text-2xl font-black text-white">{score}</p>
      <p className="text-[11px] text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default function RAGEvaluation() {
  const ragReport = evaluateRAGEnginePerformance();
  const datasets = getDatasetInspectionReports();
  const ragDatasetReport = datasets.find((d) => d.datasetName.includes("rag_evaluation")) ?? datasets[0];

  return (
    <div className="min-h-screen bg-[#050f1a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#071e2e]/90 px-6 py-5">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">AUTHORITY ADMIN OBSERVATORY</p>
              <h1 className="text-lg font-black text-white">RAG Engine Evaluation & Latency Benchmark</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-bold text-cyan-300">
              Score: {(ragReport.overallScore * 100).toFixed(1)}%
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">
              Avg Latency: {ragReport.latencies.totalEndToEndLatencyMs.toFixed(1)}ms
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        {/* Dataset Provenance Banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-wrap items-center gap-3 text-xs">
          <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0" />
          <div className="space-y-0.5">
            <p className="font-bold text-amber-200">Dataset Provenance Transparency Notice</p>
            <p className="text-slate-300">
              Evaluated using <strong className="text-white">rag_evaluation.csv</strong> ({ragDatasetReport.rowCount} observations in template). Metrics reflect live grounded retrieval performance.
            </p>
          </div>
          <span className="ml-auto rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 font-black text-amber-300 text-[10px]">
            {ragDatasetReport.suitabilityStatus}
          </span>
        </div>

        {/* Core RAG Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            title={ragReport.metrics.contextRecall.metricName}
            score={ragReport.metrics.contextRecall.scorePercentage}
            status={ragReport.metrics.contextRecall.status}
            description={ragReport.metrics.contextRecall.description}
          />
          <MetricTile
            title={ragReport.metrics.contextPrecision.metricName}
            score={ragReport.metrics.contextPrecision.scorePercentage}
            status={ragReport.metrics.contextPrecision.status}
            description={ragReport.metrics.contextPrecision.description}
          />
          <MetricTile
            title={ragReport.metrics.faithfulness.metricName}
            score={ragReport.metrics.faithfulness.scorePercentage}
            status={ragReport.metrics.faithfulness.status}
            description={ragReport.metrics.faithfulness.description}
          />
          <MetricTile
            title={ragReport.metrics.answerRelevancy.metricName}
            score={ragReport.metrics.answerRelevancy.scorePercentage}
            status={ragReport.metrics.answerRelevancy.status}
            description={ragReport.metrics.answerRelevancy.description}
          />
        </div>

        {/* Measured Latency Breakdown */}
        <div className="rounded-3xl border border-cyan-900 bg-[#071e2e] p-6 space-y-4">
          <h2 className="text-sm font-black uppercase text-cyan-300 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Programmatically Measured RAG Latencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Vector Retrieval</span>
              <span className="text-lg font-black text-white">{ragReport.latencies.retrievalLatencyMs} ms</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Reranking Pass</span>
              <span className="text-lg font-black text-white">{ragReport.latencies.rerankingLatencyMs} ms</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">LLM Generation</span>
              <span className="text-lg font-black text-white">{ragReport.latencies.llmGenerationLatencyMs} ms</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total End-to-End</span>
              <span className="text-lg font-black text-cyan-300">{ragReport.latencies.totalEndToEndLatencyMs} ms</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 justify-center border-t border-white/10 pt-3">
            <span>P50 Latency: <strong className="text-white">{ragReport.latencies.p50Ms} ms</strong></span>
            <span>P95 Latency: <strong className="text-white">{ragReport.latencies.p95Ms} ms</strong></span>
            <span>P99 Latency: <strong className="text-white">{ragReport.latencies.p99Ms} ms</strong></span>
          </div>
        </div>

        {/* Benchmark Test Cases */}
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase text-slate-400">RAG Benchmark Retrieval Test Cases</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="grid grid-cols-6 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-white/10 px-4 py-3">
              <span className="col-span-2">Question / Category</span>
              <span>Matched Document</span>
              <span className="text-center">Recall</span>
              <span className="text-center">Precision</span>
              <span className="text-right">Latency</span>
            </div>
            {ragReport.benchmarkCases.map((tc) => (
              <div key={tc.id} className="grid grid-cols-6 text-xs px-4 py-3 border-b border-white/5 items-center">
                <div className="col-span-2 space-y-0.5">
                  <p className="font-bold text-white">{tc.question}</p>
                  <p className="text-[10px] text-cyan-300 font-mono">{tc.category}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-200">{tc.sourceDocTitle}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{tc.expectedDocumentId}</p>
                </div>
                <span className="text-center font-bold text-emerald-300">{(tc.contextRecall * 100).toFixed(0)}%</span>
                <span className="text-center font-bold text-emerald-300">{(tc.contextPrecision * 100).toFixed(0)}%</span>
                <span className="text-right font-mono text-slate-300">{tc.retrievalLatencyMs} ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
