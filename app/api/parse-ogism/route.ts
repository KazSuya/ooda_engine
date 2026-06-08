import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { OgismData, GoalSet } from "@/app/types";

function extractText(cell: unknown): string {
  if (!cell) return "";
  if (typeof cell === "string") return cell.trim();
  if (typeof cell === "number") return String(cell);
  return "";
}

function findCellContaining(
  sheet: XLSX.WorkSheet,
  keyword: string
): string | null {
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:Z100");
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = sheet[addr];
      const val = extractText(cell?.v);
      if (val.includes(keyword)) return val;
    }
  }
  return null;
}

function getCellValue(
  sheet: XLSX.WorkSheet,
  row: number,
  col: number
): string {
  const addr = XLSX.utils.encode_cell({ r: row, c: col });
  return extractText(sheet[addr]?.v);
}

function getRowValues(
  sheet: XLSX.WorkSheet,
  row: number,
  maxCol: number
): string[] {
  const values: string[] = [];
  for (let c = 0; c <= maxCol; c++) {
    values.push(getCellValue(sheet, row, c));
  }
  return values;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });

    // Try to find OGISM sheet
    const ogismSheetName =
      workbook.SheetNames.find(
        (n) => n.includes("OGISM") || n.includes("ogism")
      ) || workbook.SheetNames[0];

    const sheet = workbook.Sheets[ogismSheetName];
    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:Z200");

    // Extract all rows as text
    const rows: string[][] = [];
    for (let r = range.s.r; r <= range.e.r; r++) {
      rows.push(getRowValues(sheet, r, Math.min(range.e.c, 10)));
    }

    // Helper to find row index containing keyword
    const findRowIdx = (keyword: string): number => {
      return rows.findIndex((row) => row.some((v) => v.includes(keyword)));
    };

    // Extract company vision
    const visionRowIdx = findRowIdx("全社Vision");
    const companyVision =
      visionRowIdx >= 0
        ? rows[visionRowIdx].find((v) => v.includes("全社Vision")) || ""
        : "";

    // Extract department vision
    const deptVisionRowIdx = findRowIdx("部門Vision");
    const departmentVision =
      deptVisionRowIdx >= 0
        ? rows[deptVisionRowIdx].find((v) => v.length > 20) || ""
        : "";

    // Extract period
    const periodRow = rows.find(
      (r) => r.some((v) => v.includes("対象期間")) || r.some((v) => v.match(/\d{4}年\d+月\d+日/))
    );
    const period =
      periodRow
        ?.find((v) => v.includes("年") && v.includes("月"))
        ?.match(/(\d{4}年\d+月\d+日[～〜~].+?\d{4}年\d+月\d+日)/)?.[1] || "";

    // Extract employee info
    const leaderRow = rows.find((r) =>
      r.some((v) => v.includes("SCRUM Leader") || v.includes("Leader"))
    );
    const leaderText =
      leaderRow?.find((v) => v.includes("SCRUM Leader") || (v.includes("氏名") && v.length > 5)) || "";
    const employeeNameMatch = leaderText.match(/氏名\s*(.+)$/);
    const employeeIdMatch = leaderText.match(/(\d{5})/);

    // Extract target name
    const targetRow = rows.find((r) =>
      r.some((v) => v.includes("具体的名称"))
    );
    const targetName =
      targetRow
        ?.find((v) => v.includes("具体的名称"))
        ?.replace(/^ＯＧＩＳＭ.*具体的名称：/, "")
        .trim() || "";

    // Find the main OGISM content row (large objectives cell)
    const objectivesRowIdx = rows.findIndex((r) =>
      r.some(
        (v) =>
          v.length > 200 &&
          (v.includes("目標") || v.includes("Objective") || v.includes("詳細目標"))
      )
    );

    let objectives = "";
    let currentAnalysis = "";
    let environmentForecast = "";
    let riskChance = "";
    const goalSets: GoalSet[] = [];

    if (objectivesRowIdx >= 0) {
      const mainRow = rows[objectivesRowIdx];
      objectives = mainRow.find((v) => v.length > 200) || "";
    }

    // Extract current analysis
    const analysisRowIdx = findRowIdx("現状分析");
    if (analysisRowIdx >= 0 && rows[analysisRowIdx + 1]) {
      currentAnalysis =
        rows[analysisRowIdx + 1].find((v) => v.length > 50) || "";
    }

    // Extract environment forecast
    const envRowIdx = findRowIdx("環境変化予測");
    if (envRowIdx >= 0 && rows[envRowIdx + 1]) {
      environmentForecast =
        rows[envRowIdx + 1].find((v) => v.length > 50) || "";
    }

    // Extract risk & chance
    const riskRowIdx = findRowIdx("Risk");
    if (riskRowIdx >= 0) {
      riskChance = rows[riskRowIdx].find((v) => v.length > 20) || "";
      if (rows[riskRowIdx + 1]) {
        riskChance +=
          "\n" + (rows[riskRowIdx + 1].find((v) => v.length > 20) || "");
      }
    }

    // Extract goal sets (課題・戦略ペア)
    const goalSetRows = rows.filter((r) =>
      r.some((v) => v.match(/^課題[①②③④⑤]/))
    );

    goalSetRows.forEach((row, idx) => {
      const issueText = row.find((v) => v.match(/^課題[①②③④⑤]/)) || "";
      const strategyText =
        row.find((v) => v.match(/^戦略[①②③④⑤]/)) || "";
      if (issueText || strategyText) {
        goalSets.push({
          id: idx + 1,
          title: `目標セット${idx + 1}`,
          objective: "",
          goals: "",
          issues: issueText,
          strategies: strategyText,
          measures: "",
        });
      }
    });

    // Parse the large objectives row for individual goal details
    const detailRowIdx = rows.findIndex((r) =>
      r.some((v) => v.includes("詳細目標") && v.includes("①"))
    );
    if (detailRowIdx >= 0) {
      const detailText =
        rows[detailRowIdx].find(
          (v) => v.includes("詳細目標") && v.includes("①")
        ) || "";
      // Split individual goals
      const goalMatches = detailText.match(/[①②③④⑤][^①②③④⑤]+/g) || [];
      goalMatches.forEach((g, i) => {
        if (goalSets[i]) {
          goalSets[i].objective = g.trim();
        } else {
          goalSets.push({
            id: i + 1,
            title: `目標セット${i + 1}`,
            objective: g.trim(),
            goals: "",
            issues: "",
            strategies: "",
            measures: "",
          });
        }
      });
    }

    const data: OgismData = {
      employeeName: employeeNameMatch?.[1]?.trim() || "須山和弘",
      employeeId: employeeIdMatch?.[1] || "44070",
      department: "MDX本部",
      period: period || "2026年1月1日〜2026年6月30日",
      targetName,
      companyVision: companyVision
        .replace("全社Vision：", "")
        .trim(),
      departmentVision: departmentVision
        .replace("部門Vision：", "")
        .trim(),
      objectives,
      goalSets,
      currentAnalysis,
      environmentForecast,
      riskChance,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to parse file" },
      { status: 500 }
    );
  }
}
