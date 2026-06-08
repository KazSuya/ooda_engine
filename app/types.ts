export interface GoalSet {
  id: number;
  title: string;
  objective: string;
  goals: string;
  issues: string;
  strategies: string;
  measures: string;
}

export interface OgismData {
  employeeName: string;
  employeeId: string;
  department: string;
  period: string;
  targetName: string;
  companyVision: string;
  departmentVision: string;
  objectives: string;
  goalSets: GoalSet[];
  currentAnalysis: string;
  environmentForecast: string;
  riskChance: string;
}
