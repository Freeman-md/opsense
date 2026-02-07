import type { Assumption, ProcessModel } from "./types";

export type ConfidenceLevel = "high" | "medium" | "low";

export type ConfidenceResult = {
  level: ConfidenceLevel;
  reasons: string[];
  missingFields: string[];
};

export function evaluateConfidence(
  processModel: ProcessModel,
  assumptions: Assumption[],
): ConfidenceResult {
  const reasons: string[] = [];
  const missingFields: string[] = [];

  const activitiesMissing =
    !processModel.activities || processModel.activities.length === 0;
  const decisionPointsMissing =
    !processModel.decisionPoints || processModel.decisionPoints.length === 0;
  const triggersMissing =
    !processModel.triggers || processModel.triggers.length === 0;
  const outcomesMissing =
    !processModel.outcomes || processModel.outcomes.length === 0;

  if (activitiesMissing) {
    missingFields.push("activities");
    reasons.push("Missing activities.");
  }

  if (decisionPointsMissing) {
    missingFields.push("decisionPoints");
    reasons.push("Missing decision points.");
  }

  if (triggersMissing) {
    missingFields.push("triggers");
    reasons.push("Missing triggers.");
  }

  if (outcomesMissing) {
    missingFields.push("outcomes");
    reasons.push("Missing outcomes.");
  }

  const lowConfidenceAssumptions = assumptions.filter(
    (assumption) => assumption.confidenceLevel === "low",
  ).length;

  if (lowConfidenceAssumptions >= 1) {
    reasons.push("Contains low-confidence assumptions.");
  }

  if (lowConfidenceAssumptions >= 3) {
    reasons.push("Three or more low-confidence assumptions.");
  }

  const isLow =
    activitiesMissing ||
    decisionPointsMissing ||
    lowConfidenceAssumptions >= 3;
  const isMedium =
    triggersMissing || outcomesMissing || lowConfidenceAssumptions >= 1;

  const level: ConfidenceLevel = isLow
    ? "low"
    : isMedium
      ? "medium"
      : "high";

  return {
    level,
    reasons,
    missingFields,
  };
}
