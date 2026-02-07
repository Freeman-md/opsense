export type ProcessDescription = {
  rawText: string;
  contextNotes?: string;
};

export type ProcessModel = {
  activities: Activity[];
  decisionPoints: DecisionPoint[];
  triggers?: string[];
  outcomes?: string[];
};

export type Activity = {
  name: string;
  frequency?: string;
  manualOrAutomated?: "manual" | "automated" | "unknown";
};

export type DecisionPoint = {
  condition: string;
  possibleOutcomes: string[];
  riskLevel?: "low" | "medium" | "high" | "unknown";
};

export type Assumption = {
  description: string;
  confidenceLevel: "low" | "medium" | "high";
  source: "input" | "inference";
};

export type Recommendation = {
  target: string;
  recommendationType: "automate" | "caution" | "do_not_automate";
  rationale: string;
};
