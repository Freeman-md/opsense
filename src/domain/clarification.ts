import type { Assumption, ProcessModel } from "./types";
import { evaluateConfidence, type ConfidenceResult } from "./confidence";

export type ClarificationDecision = {
  shouldAsk: boolean;
  questions: string[];
  reason: string;
};

type ClarificationInput = {
  processModel: ProcessModel;
  assumptions: Assumption[];
};

const MAX_ASSUMPTION_QUESTIONS = 3;
const MAX_TOTAL_QUESTIONS = 6;

const questionForMissingField = (field: string): string | null => {
  switch (field) {
    case "triggers":
      return "What starts this process?";
    case "outcomes":
      return "What does \"done\" look like here?";
    case "decisionPoints":
      return "Where do you or someone else make a choice or approval?";
    case "activities":
      return "What are the main steps that happen, in order?";
    default:
      return null;
  }
};

const questionFromAssumption = (description: string): string => {
  const frequencyMatch =
    /Frequency for activity "(.+)" is not specified\./.exec(description);
  if (frequencyMatch) {
    return `How often does "${frequencyMatch[1]}" happen?`;
  }

  const manualAutomatedMatch =
    /Manual or automated status for activity "(.+)" is not specified\./.exec(
      description,
    );
  if (manualAutomatedMatch) {
    return `Is "${manualAutomatedMatch[1]}" manual or automated?`;
  }

  const outcomesMatch =
    /Possible outcomes for decision "(.+)" are not specified\./.exec(
      description,
    );
  if (outcomesMatch) {
    return `What are the possible outcomes for "${outcomesMatch[1]}"?`;
  }

  const riskMatch =
    /Risk level for decision "(.+)" is not specified\./.exec(description);
  if (riskMatch) {
    return `What is the risk level for "${riskMatch[1]}"?`;
  }

  if (description === "Process triggers are not specified.") {
    return "What starts this process?";
  }

  if (description === "Process outcomes are not specified.") {
    return "What does \"done\" look like here?";
  }

  if (description === "No decision points were specified in the input.") {
    return "Where do you or someone else make a choice or approval?";
  }

  if (description === "No activities were specified in the input.") {
    return "What are the main steps that happen, in order?";
  }

  if (description.endsWith("?")) {
    return description;
  }

  return `Can you clarify: ${description}`;
};

const buildReason = (
  confidence: ConfidenceResult,
  lowAssumptionCount: number,
  shouldAsk: boolean,
): string => {
  if (!shouldAsk) {
    return "No clarification needed based on current confidence level.";
  }

  const reasonParts: string[] = [];
  if (confidence.missingFields.length > 0) {
    reasonParts.push("missing information");
  }
  if (lowAssumptionCount > 0) {
    reasonParts.push("low-confidence assumptions");
  }

  if (!reasonParts.length) {
    return "Clarification needed due to low confidence.";
  }

  return `Clarification needed due to ${reasonParts.join(" and ")}.`;
};

export function getClarificationDecision({
  processModel,
  assumptions,
}: ClarificationInput): ClarificationDecision {
  const confidence = evaluateConfidence(processModel, assumptions);
  const lowConfidenceAssumptions = assumptions.filter(
    (assumption) => assumption.confidenceLevel === "low",
  );

  const shouldAsk =
    confidence.level === "low" ||
    (confidence.level === "medium" && lowConfidenceAssumptions.length >= 1);

  const questions: string[] = [];

  confidence.missingFields.forEach((field) => {
    const question = questionForMissingField(field);
    if (question) {
      questions.push(question);
    }
  });

  const assumptionQuestions: string[] = [];
  for (const assumption of lowConfidenceAssumptions) {
    if (assumptionQuestions.length >= MAX_ASSUMPTION_QUESTIONS) break;
    if (!assumption.description) continue;
    const question = questionFromAssumption(assumption.description);
    if (!questions.includes(question) && !assumptionQuestions.includes(question)) {
      assumptionQuestions.push(question);
    }
  }

  const combined = [...questions, ...assumptionQuestions].slice(
    0,
    MAX_TOTAL_QUESTIONS,
  );

  return {
    shouldAsk,
    questions: shouldAsk ? combined : [],
    reason: buildReason(confidence, lowConfidenceAssumptions.length, shouldAsk),
  };
}
