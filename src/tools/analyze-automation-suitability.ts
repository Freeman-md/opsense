import { defineTool } from "@tambo-ai/react";
import { z } from "zod";
import {
  DECISION_RULE_HIGH_FAILURE_IMPACT,
  DECISION_RULE_LACK_OF_CLARITY_LOWERS_CONFIDENCE,
  DECISION_RULE_REPETITIVE_LOW_RISK,
  DECISION_RULE_REQUIRES_HUMAN_JUDGMENT,
  DECISION_RULE_UNCLEAR_TRIGGERS_OUTCOMES,
} from "@/domain/decisionRules";

const analyzeAutomationSuitabilityTool = defineTool({
  name: "analyzeAutomationSuitability",
  description:
    "Evaluate automation suitability for a process model using explicit decision rules.",
  inputSchema: z.object({
    processModel: z.object({
      activities: z
        .array(
          z.object({
            name: z.string().describe("Name of the activity or step."),
            frequency: z
              .string()
              .optional()
              .describe("Optional frequency or cadence if provided."),
            manualOrAutomated: z
              .enum(["manual", "automated", "unknown"])
              .optional()
              .describe("Whether the activity is manual or automated if stated."),
          }),
        )
        .describe("Activities in the process model."),
      decisionPoints: z
        .array(
          z.object({
            condition: z
              .string()
              .describe("The condition that drives a choice."),
            possibleOutcomes: z
              .array(z.string())
              .describe("Possible outcomes noted in the input."),
            riskLevel: z
              .enum(["low", "medium", "high", "unknown"])
              .optional()
              .describe("Risk level if explicitly stated."),
          }),
        )
        .describe("Decision points in the process model."),
      triggers: z
        .array(z.string())
        .optional()
        .describe("Triggers that start the process if explicitly stated."),
      outcomes: z
        .array(z.string())
        .optional()
        .describe("Outcomes or results if explicitly stated."),
    }),
    assumptions: z
      .array(
        z.object({
          description: z
            .string()
            .describe("The assumption or uncertainty found."),
          confidenceLevel: z
            .enum(["low", "medium", "high"])
            .describe("Confidence level for the assumption."),
          source: z
            .enum(["input", "inference"])
            .describe("Whether the assumption comes from input or inference."),
        }),
      )
      .describe("Assumptions derived from interpretation."),
  }),
  outputSchema: z.array(
    z.object({
      target: z.string().describe("The activity or decision being evaluated."),
      recommendationType: z
        .enum(["automate", "caution", "do_not_automate"])
        .describe("Recommended automation stance for the target."),
      rationale: z
        .string()
        .describe("Short, factual justification tied to decision rules."),
    }),
  ),
  tool: ({ processModel, assumptions }) => {
    const { activities, decisionPoints, triggers, outcomes } = processModel;
    const recommendations: {
      target: string;
      recommendationType: "automate" | "caution" | "do_not_automate";
      rationale: string;
    }[] = [];

    const hasUnclearTriggersOrOutcomes = !triggers?.length || !outcomes?.length;
    const hasLowConfidenceAssumptions = assumptions.some(
      (assumption) => assumption.confidenceLevel === "low",
    );
    const hasInferredAssumptions = assumptions.some(
      (assumption) => assumption.source === "inference",
    );
    const hasClarityIssues =
      hasUnclearTriggersOrOutcomes ||
      hasLowConfidenceAssumptions ||
      hasInferredAssumptions;

    const hasHighRiskDecision = decisionPoints.some(
      (decisionPoint) => decisionPoint.riskLevel === "high",
    );
    const hasExplicitLowRiskDecisions =
      decisionPoints.length > 0 &&
      decisionPoints.every((decisionPoint) => decisionPoint.riskLevel === "low");

    decisionPoints.forEach((decisionPoint) => {
      if (decisionPoint.riskLevel === "high") {
        recommendations.push({
          target: `decision:${decisionPoint.condition}`,
          recommendationType: "do_not_automate",
          rationale: DECISION_RULE_HIGH_FAILURE_IMPACT,
        });
        return;
      }

      recommendations.push({
        target: `decision:${decisionPoint.condition}`,
        recommendationType: "caution",
        rationale: DECISION_RULE_REQUIRES_HUMAN_JUDGMENT,
      });
    });

    if (hasClarityIssues) {
      recommendations.push({
        target: "process",
        recommendationType: "caution",
        rationale: hasUnclearTriggersOrOutcomes
          ? DECISION_RULE_UNCLEAR_TRIGGERS_OUTCOMES
          : DECISION_RULE_LACK_OF_CLARITY_LOWERS_CONFIDENCE,
      });
    }

    if (hasExplicitLowRiskDecisions && !hasHighRiskDecision && !hasClarityIssues) {
      activities.forEach((activity) => {
        if (!activity.frequency) return;

        recommendations.push({
          target: `activity:${activity.name}`,
          recommendationType: "automate",
          rationale: DECISION_RULE_REPETITIVE_LOW_RISK,
        });
      });
    }

    return recommendations;
  },
});

export default analyzeAutomationSuitabilityTool;
