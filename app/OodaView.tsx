"use client";

import { useState } from "react";
import { OODA_WEEKS, OodaWeek } from "./ooda-demo-data";

interface OodaCardProps {
  label: string;
  subtitle: string;
  content: string;
  accentColor: string;
  onRegenerate: () => void;
}

function OodaCard({
  label,
  subtitle,
  content,
  accentColor,
  onRegenerate,
}: OodaCardProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(content);

  // Sync content when week changes
  if (text !== content && !editing) {
    setText(content);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={onRegenerate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white transition-opacity hover:opacity-90 ${accentColor}`}
          >
            <span>↺</span>
            素案を再生成する
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {editing ? "保存" : "編集"}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {editing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full min-h-48 text-sm text-gray-700 leading-relaxed resize-none outline-none border border-blue-300 rounded-lg p-3 bg-blue-50/30"
          />
        ) : (
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OodaView() {
  const [currentWeekIdx, setCurrentWeekIdx] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "OODAレポートについて何でも相談してください。今週の観察内容の整理や、方針仮説のブラッシュアップをサポートします。",
    },
  ]);

  const week: OodaWeek = OODA_WEEKS[currentWeekIdx] ?? OODA_WEEKS[0];

  const handleRegenerate = (key: string) => {
    setGeneratingKey(key);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratingKey(null);
    }, 1500);
  };

  const handleGenerateAll = () => {
    setIsGenerating(true);
    setGeneratingKey("all");
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratingKey(null);
    }, 2000);
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      {
        role: "assistant",
        text: `「${userMsg}」について検討します。今週のObserveの内容を踏まえると、OGISMの戦略①との整合性を確認しながら方針を固めることをお勧めします。具体的には…（AIが生成）`,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* OODA header bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-gray-900">週次</span>
          {/* Week selector */}
          <div className="flex items-center gap-1">
            {OODA_WEEKS.map((w, i) => (
              <button
                key={i}
                onClick={() => setCurrentWeekIdx(i)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  i === currentWeekIdx
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {w.weekLabel}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            履歴を見る
          </button>
          <button
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white rounded-md transition-all ${
              isGenerating && generatingKey === "all"
                ? "bg-orange-400 opacity-70"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {isGenerating && generatingKey === "all" ? (
              <>
                <span className="animate-spin">↻</span> 生成中...
              </>
            ) : (
              "全項目の素案を作成する"
            )}
          </button>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white rounded-md transition-colors ${
              chatOpen ? "bg-orange-700" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            💬 チャット
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main OODA grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4 h-full" style={{ minHeight: "600px" }}>
            {/* O1: Observe */}
            <OodaCard
              key={`observe-${currentWeekIdx}`}
              label="Observe"
              subtitle="観察"
              content={week.observe}
              accentColor="bg-orange-500"
              onRegenerate={() => handleRegenerate("observe")}
            />

            {/* O2: Orient */}
            <OodaCard
              key={`orient-${currentWeekIdx}`}
              label="Orient"
              subtitle="気づき » 自身の方針"
              content={week.orient}
              accentColor="bg-orange-500"
              onRegenerate={() => handleRegenerate("orient")}
            />

            {/* D: Decide */}
            <OodaCard
              key={`decide-${currentWeekIdx}`}
              label="Decide"
              subtitle="決断（議論前 » 議論後）"
              content={week.decide}
              accentColor="bg-blue-600"
              onRegenerate={() => handleRegenerate("decide")}
            />

            {/* A: Action */}
            <OodaCard
              key={`action-${currentWeekIdx}`}
              label="Act"
              subtitle="次の行動"
              content={week.action}
              accentColor="bg-blue-600"
              onRegenerate={() => handleRegenerate("action")}
            />
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="w-80 border-l border-gray-200 bg-white flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">壁打ちチャット</p>
              <button
                onClick={() => setChatOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`${
                    msg.role === "user" ? "ml-6" : "mr-6"
                  }`}
                >
                  <div
                    className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  placeholder="メッセージを入力..."
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                />
                <button
                  onClick={handleSendChat}
                  className="px-3 py-2 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isGenerating && generatingKey !== "all" && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-xs px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
          <span className="animate-spin inline-block">↻</span>
          素案を生成中...
        </div>
      )}
    </div>
  );
}
