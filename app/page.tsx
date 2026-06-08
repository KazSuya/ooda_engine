"use client";

import { useState, useRef } from "react";
import { OgismData } from "./types";
import { DEMO_DATA } from "./demo-data";
import OodaView from "./OodaView";
import InsightView from "./InsightView";

type SectionKey =
  | "companyVision"
  | "departmentVision"
  | "objectives"
  | "goalOverview"
  | `goalSet_${number}`
  | "currentAnalysis"
  | "environmentForecast"
  | "riskChance";

type Panel = "ooda-loop" | "insight";

export default function Home() {
  const [activePanel, setActivePanel] = useState<Panel>("ooda-loop");
  const [activeTab, setActiveTab] = useState<"ogism" | "ooda">("ogism");
  const [activeSection, setActiveSection] =
    useState<SectionKey>("companyVision");
  const [ogismData, setOgismData] = useState<OgismData>(DEMO_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-ogism", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data: OgismData = await res.json();
        setOgismData(data);
        setActiveSection("companyVision");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!ogismData) return null;
    switch (activeSection) {
      case "companyVision":
        return (
          <ContentCard title="全社Vision">
            <VisionBlock label="Vision" text={ogismData.companyVision} />
          </ContentCard>
        );
      case "departmentVision":
        return (
          <ContentCard title="部門Vision">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ogismData.departmentVision}
            </p>
          </ContentCard>
        );
      case "objectives":
        return (
          <ContentCard title="Objectives 目的">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ogismData.objectives}
            </p>
          </ContentCard>
        );
      case "goalOverview":
        return (
          <ContentCard title="Goals 概要">
            <div className="space-y-3">
              {ogismData.goalSets.map((g) => (
                <div
                  key={g.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  onClick={() =>
                    setActiveSection(`goalSet_${g.id}` as SectionKey)
                  }
                >
                  <p className="text-sm font-semibold text-gray-800">
                    {g.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {g.objective}
                  </p>
                </div>
              ))}
            </div>
          </ContentCard>
        );
      case "currentAnalysis":
        return (
          <ContentCard title="現状分析">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ogismData.currentAnalysis}
            </p>
          </ContentCard>
        );
      case "environmentForecast":
        return (
          <ContentCard title="環境変化予測">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ogismData.environmentForecast}
            </p>
          </ContentCard>
        );
      case "riskChance":
        return (
          <ContentCard title="Risk &amp; Chance">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {ogismData.riskChance}
            </p>
          </ContentCard>
        );
      default: {
        const idStr = activeSection.replace("goalSet_", "");
        const goalSet = ogismData.goalSets.find(
          (g) => g.id === parseInt(idStr)
        );
        if (!goalSet) return null;
        return (
          <ContentCard title={goalSet.title}>
            <div className="space-y-4">
              {goalSet.objective && (
                <Section
                  label="目的 (Objective)"
                  text={goalSet.objective}
                  color="blue"
                />
              )}
              {goalSet.goals && (
                <Section
                  label="数値目標 (Goals)"
                  text={goalSet.goals}
                  color="green"
                />
              )}
              {goalSet.issues && (
                <Section
                  label="課題 (Issues)"
                  text={goalSet.issues}
                  color="orange"
                />
              )}
              {goalSet.strategies && (
                <Section
                  label="戦略 (Strategies)"
                  text={goalSet.strategies}
                  color="purple"
                />
              )}
              {goalSet.measures && (
                <Section
                  label="判定基準 (Measures)"
                  text={goalSet.measures}
                  color="gray"
                />
              )}
            </div>
          </ContentCard>
        );
      }
    }
  };

  return (
    <div
      className="h-screen flex bg-gray-100"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFileUpload(f);
      }}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500/20 border-4 border-dashed border-blue-500 z-50 flex items-center justify-center pointer-events-none">
          <p className="text-blue-700 text-2xl font-bold bg-white px-6 py-3 rounded-xl shadow">
            OGISMファイルをドロップ
          </p>
        </div>
      )}

      {/* ── Global side panel ── */}
      <nav className="w-14 bg-gray-900 flex flex-col items-center py-3 gap-1 shrink-0">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mb-3">
          <span className="text-white text-xs font-black">OE</span>
        </div>

        <NavPanelBtn
          icon="🔄"
          label="OODA-LOOP"
          active={activePanel === "ooda-loop"}
          onClick={() => setActivePanel("ooda-loop")}
        />
        <NavPanelBtn
          icon="💡"
          label="インサイト発掘"
          active={activePanel === "insight"}
          onClick={() => setActivePanel("insight")}
        />
      </nav>

      {/* ── Main area (header + content) ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between h-12 shrink-0">
        <div className="flex items-center">
          <h1 className="text-sm font-semibold text-gray-900 mr-4">
            OODA engine
          </h1>
          {activePanel === "ooda-loop" && (
            <>
              <TabBtn
                label="OGISM"
                active={activeTab === "ogism"}
                onClick={() => setActiveTab("ogism")}
              />
              <TabBtn
                label="OODA"
                active={activeTab === "ooda"}
                onClick={() => setActiveTab("ooda")}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            {ogismData.period}
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? "読込中..." : "Excel読込"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileUpload(f);
            }}
          />
          <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {ogismData.employeeName[0]}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900 leading-tight">
                {ogismData.employeeName}
              </p>
              <p className="text-xs text-gray-400 leading-tight">
                {ogismData.department} &#xB7; {ogismData.employeeId}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Panel content ── */}
      {activePanel === "insight" ? (
        <div className="flex-1 overflow-hidden">
          <InsightView />
        </div>
      ) : activeTab === "ogism" ? (
        <div className="flex flex-1 overflow-hidden">
          {/* OGISM Sidebar */}
          <aside className="w-52 bg-white border-r border-gray-200 overflow-y-auto shrink-0 py-3">
            <SidebarGroup label="VISION">
              <SidebarItem
                label="全社Vision"
                active={activeSection === "companyVision"}
                onClick={() => setActiveSection("companyVision")}
              />
              <SidebarItem
                label="部門Vision"
                active={activeSection === "departmentVision"}
                onClick={() => setActiveSection("departmentVision")}
              />
            </SidebarGroup>

            <SidebarGroup label="OBJECTIVES">
              <SidebarItem
                label="Objectives 目的"
                active={activeSection === "objectives"}
                onClick={() => setActiveSection("objectives")}
              />
            </SidebarGroup>

            <SidebarGroup label="GOALS">
              <SidebarItem
                label="Goals 概要"
                active={activeSection === "goalOverview"}
                onClick={() => setActiveSection("goalOverview")}
              />
              {ogismData.goalSets.map((g) => (
                <SidebarItem
                  key={g.id}
                  label={g.title}
                  active={activeSection === `goalSet_${g.id}`}
                  onClick={() =>
                    setActiveSection(`goalSet_${g.id}` as SectionKey)
                  }
                  indent
                />
              ))}
            </SidebarGroup>

            <SidebarGroup label="ANALYSIS">
              <SidebarItem
                label="現状分析"
                active={activeSection === "currentAnalysis"}
                onClick={() => setActiveSection("currentAnalysis")}
              />
              <SidebarItem
                label="環境変化予測"
                active={activeSection === "environmentForecast"}
                onClick={() => setActiveSection("environmentForecast")}
              />
              <SidebarItem
                label="Risk &amp; Chance"
                active={activeSection === "riskChance"}
                onClick={() => setActiveSection("riskChance")}
              />
            </SidebarGroup>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <OodaView />
        </div>
      )}

      </div>{/* end main area */}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function NavPanelBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-colors group relative ${
        active
          ? "bg-gray-700 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span className="text-lg leading-none">{icon}</span>
      {/* Tooltip */}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        {label}
      </div>
    </button>
  );
}

function TabBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 h-12 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

function SidebarGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="space-y-0.5 px-2">{children}</div>
    </div>
  );
}

function SidebarItem({
  label,
  active,
  onClick,
  indent = false,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-full text-left py-1.5 text-xs rounded-md transition-colors truncate block ${
        indent ? "pl-5 pr-2" : "px-2"
      } ${
        active
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}

function ContentCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-3xl">
      <h2 className="text-base font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
        {title}
      </h2>
      {children}
    </div>
  );
}

function VisionBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
        {label}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200",
  green: "bg-green-50 border-green-200",
  orange: "bg-orange-50 border-orange-200",
  purple: "bg-purple-50 border-purple-200",
  gray: "bg-gray-50 border-gray-200",
};

const labelColorMap: Record<string, string> = {
  blue: "text-blue-600",
  green: "text-green-600",
  orange: "text-orange-600",
  purple: "text-purple-600",
  gray: "text-gray-500",
};

function Section({
  label,
  text,
  color,
}: {
  label: string;
  text: string;
  color: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${colorMap[color]}`}>
      <p className={`text-xs font-semibold mb-2 ${labelColorMap[color]}`}>
        {label}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}
