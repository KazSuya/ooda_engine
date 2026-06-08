"use client";

import { useState, useRef } from "react";
import { INSIGHT_ROWS, InsightRow } from "./insight-demo-data";

// ── Column definitions ────────────────────────────────────────────
interface ColDef {
  key: keyof InsightRow | "chatPreview";
  label: string;
  width: number;
  render?: (row: InsightRow) => React.ReactNode;
}

const COLUMNS: ColDef[] = [
  { key: "searchScore", label: "検索スコア", width: 80 },
  { key: "callId", label: "通話ID", width: 200 },
  { key: "speaker", label: "話者", width: 80 },
  { key: "productUser", label: "商品使用者", width: 100 },
  { key: "estimatedAge", label: "推定年齢", width: 90 },
  { key: "careLevel", label: "介護レベル", width: 80 },
  { key: "purchasedProduct", label: "購入商品_推定", width: 120 },
  { key: "inquirySummary", label: "問い合わせサマリ", width: 220 },
  { key: "satisfactionScore", label: "満足度スコア", width: 90 },
  { key: "categoryLarge", label: "大分類", width: 90 },
  { key: "categorySmall", label: "小分類", width: 100 },
  { key: "triggerDetail", label: "契機(詳細)", width: 220 },
  { key: "triggerSummary", label: "契機(要約)", width: 160 },
  { key: "triggerTags", label: "契機タグ", width: 200 },
  { key: "triggerHearingLevel", label: "契機ヒアリング度", width: 110 },
  { key: "backgroundDetail", label: "背景(詳細)", width: 220 },
  { key: "backgroundSummary", label: "背景(要約)", width: 160 },
  { key: "backgroundTags", label: "背景タグ", width: 200 },
  { key: "backgroundHearingLevel", label: "背景ヒアリング度", width: 110 },
  { key: "currentStateDetail", label: "現状(詳細)", width: 220 },
  { key: "currentStateSummary", label: "現状(要約)", width: 160 },
  { key: "currentStateTags", label: "現状タグ", width: 200 },
  { key: "currentHearingLevel", label: "現状ヒアリング度", width: 110 },
  { key: "emotion", label: "エモーション", width: 120 },
  { key: "emotionLevel", label: "エモーション顕在度", width: 120 },
  { key: "manifestNeeds", label: "顕在ニーズ", width: 200 },
  { key: "insight", label: "インサイト", width: 240 },
  { key: "personalizeScore", label: "パーソナライズスコア", width: 130 },
  { key: "improvementMaterial", label: "改善策_素材", width: 220 },
  { key: "improvementProduct", label: "改善策_商品", width: 220 },
  { key: "improvementService", label: "改善策_サービス", width: 220 },
  { key: "needsNovelty", label: "ニーズ新規性", width: 90 },
  {
    key: "chatPreview",
    label: "会話プレビュー",
    width: 100,
  },
];

const INTERNAL_SOURCES = ["FC", "BC", "WC", "PC", "doqat"] as const;
const EXTERNAL_SOURCES = ["SNS"] as const;
const AGENTS = ["事業性検証agent"] as const;

export default function InsightView() {
  const [selectedSource, setSelectedSource] = useState<string>("WC");
  const [selectedAgent, setSelectedAgent] = useState<string>("事業性検証agent");
  const [satisfactionRange, setSatisfactionRange] = useState(100);
  const [insightRange, setInsightRange] = useState(100);
  const [noveltyRange, setNoveltyRange] = useState(100);
  const [keyword, setKeyword] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRow, setChatRow] = useState<InsightRow | null>(null);
  const [filterOpen, setFilterOpen] = useState(true);
  const [displayCount, setDisplayCount] = useState(200);
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredRows = INSIGHT_ROWS.filter(
    (r) =>
      r.satisfactionScore <= satisfactionRange &&
      r.personalizeScore <= insightRange &&
      r.needsNovelty <= noveltyRange &&
      (!keyword || r.inquirySummary.includes(keyword) || r.insight.includes(keyword))
  );

  const openChat = (row: InsightRow) => {
    setChatRow(row);
    setChatOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold text-gray-800">インサイトビュー</h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-md hover:bg-orange-600 transition-colors">
          💬 チャット
        </button>
      </div>

      {/* ── Filter panel ── */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-5 py-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700">検索条件</span>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            {filterOpen ? "▲" : "▼"}
          </button>
        </div>

        {filterOpen && (
          <div className="px-5 pb-4 grid grid-cols-[auto_1fr_auto] gap-x-8 gap-y-3 items-start">
            {/* Left: data source + agent */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">表示データ</p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-16 shrink-0">社内Data</span>
                    <div className="flex gap-1">
                      {INTERNAL_SOURCES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSource(s)}
                          className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                            selectedSource === s
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-16 shrink-0">社外Data</span>
                    <div className="flex gap-1">
                      {EXTERNAL_SOURCES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSource(s)}
                          className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                            selectedSource === s
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">エージェント</p>
                <div className="flex gap-1 flex-wrap">
                  {AGENTS.map((a) => (
                    <button
                      key={a}
                      onClick={() => setSelectedAgent(a)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                        selectedAgent === a
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-500 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: sliders */}
            <div className="space-y-3">
              <SliderFilter
                label="商品満足度スコア"
                value={satisfactionRange}
                onChange={setSatisfactionRange}
              />
              <SliderFilter
                label="パーソナライズスコア"
                value={insightRange}
                onChange={setInsightRange}
              />
              <SliderFilter
                label="ニーズ新規性"
                value={noveltyRange}
                onChange={setNoveltyRange}
              />
            </div>

            {/* Right: keyword search */}
            <div className="w-72">
              <p className="text-xs text-gray-500 mb-1">KW検索</p>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="例：就寝 サイズ不適合 質感 旅行先"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-xs outline-none focus:border-blue-400 mb-2"
              />
              <button className="w-full px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                🔍 検索
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Table area ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Table header bar */}
        <div className="px-5 py-2 flex items-center justify-between bg-white border-b border-gray-100 shrink-0">
          <p className="text-xs font-semibold text-gray-700">
            インサイトビュー（{selectedSource}）：
            <span className="text-blue-600">検索結果{filteredRows.length * 33}件</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              表示データ: <span className="font-semibold text-gray-700">{selectedSource}</span>
            </span>
            <span className="text-xs text-gray-400">表示件数:</span>
            <select
              value={displayCount}
              onChange={(e) => setDisplayCount(Number(e.target.value))}
              className="text-xs border border-gray-300 rounded px-2 py-1 outline-none"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors">
              ↓ CSV
            </button>
          </div>
        </div>

        {/* Scrollable table */}
        <div ref={tableRef} className="flex-1 overflow-auto">
          <table className="text-xs border-collapse" style={{ tableLayout: "fixed" }}>
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-700 text-white">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left font-medium whitespace-nowrap border-r border-gray-600"
                    style={{ width: col.width, minWidth: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIdx) => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                    rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-3 align-top border-r border-gray-100"
                      style={{ width: col.width, minWidth: col.width }}
                    >
                      {col.key === "chatPreview" ? (
                        <button
                          onClick={() => openChat(row)}
                          className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-colors"
                          title="会話ログを見る"
                        >
                          <span className="text-gray-400 text-xs">💬</span>
                        </button>
                      ) : col.key === "satisfactionScore" ? (
                        <ScoreChip
                          value={row.satisfactionScore as number}
                          max={100}
                          color={
                            (row.satisfactionScore as number) >= 70
                              ? "green"
                              : (row.satisfactionScore as number) >= 40
                              ? "yellow"
                              : "red"
                          }
                        />
                      ) : col.key === "needsNovelty" || col.key === "personalizeScore" ? (
                        <ScoreChip
                          value={row[col.key] as number}
                          max={100}
                          color="blue"
                        />
                      ) : col.key === "emotionLevel" ? (
                        <ScoreChip
                          value={row[col.key] as number}
                          max={100}
                          color="orange"
                        />
                      ) : (
                        <div
                          className={`text-gray-700 leading-relaxed ${
                            [
                              "inquirySummary",
                              "triggerDetail",
                              "backgroundDetail",
                              "currentStateDetail",
                              "insight",
                              "improvementMaterial",
                              "improvementProduct",
                              "improvementService",
                            ].includes(col.key)
                              ? "line-clamp-3"
                              : "whitespace-nowrap overflow-hidden text-ellipsis"
                          }`}
                        >
                          {String(row[col.key as keyof InsightRow] ?? "")}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Chat log modal ── */}
      {chatOpen && chatRow && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">💬</span>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  通話ログ（{chatRow.callId}）
                </p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-sm"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {chatRow.chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${
                    msg.role === "customer" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {msg.role === "agent" ? (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mb-1">
                      <span className="text-blue-600 text-xs">🎧</span>
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mb-1">
                      <span className="text-gray-400 text-xs">👤</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      msg.role === "agent"
                        ? "bg-blue-100 text-blue-900 rounded-tl-sm"
                        : "bg-orange-100 text-orange-900 rounded-tr-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function SliderFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-gray-500 w-44 shrink-0">{label}</p>
      <div className="flex items-center gap-2 flex-1">
        <span className="text-xs text-gray-400 w-4">0</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-blue-600 h-1"
        />
        <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
      </div>
    </div>
  );
}

function ScoreChip({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: "green" | "yellow" | "red" | "blue" | "orange";
}) {
  const colorMap = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[color]}`}
    >
      {value}
    </span>
  );
}
