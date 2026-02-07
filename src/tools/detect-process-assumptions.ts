import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

const detectProcessAssumptionsTool = defineTool({
  name: "detectProcessAssumptions",
  description:
    "Identify assumptions and uncertainties in a process model without resolving them.",
  inputSchema: z.object({
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
          condition: z.string().describe("The condition that drives a choice."),
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
  outputSchema: z.array(
    z.object({
      description: z.string().describe("The assumption or uncertainty found."),
      confidenceLevel: z
        .enum(["low", "medium", "high"])
        .describe("Confidence level for the assumption."),
      source: z
        .enum(["input", "inference"])
        .describe("Whether the assumption comes from input or inference."),
    }),
  ),
  tool: ({ activities, decisionPoints, triggers, outcomes }) => {
    const assumptions: {
      description: string;
      confidenceLevel: "low" | "medium" | "high";
      source: "input" | "inference";
    }[] = [];

    if (!activities.length) {
      assumptions.push({
        description: "No activities were specified in the input.",
        confidenceLevel: "low",
        source: "inference",
      });
    }

    activities.forEach((activity) => {
      if (!activity.frequency) {
        assumptions.push({
          description: `Frequency for activity "${activity.name}" is not specified.`,
          confidenceLevel: "low",
          source: "inference",
        });
      }

      if (!activity.manualOrAutomated) {
        assumptions.push({
          description: `Manual or automated status for activity "${activity.name}" is not specified.`,
          confidenceLevel: "low",
          source: "inference",
        });
      }
    });

    if (!decisionPoints.length) {
      assumptions.push({
        description: "No decision points were specified in the input.",
        confidenceLevel: "low",
        source: "inference",
      });
    }

    decisionPoints.forEach((decisionPoint) => {
      if (!decisionPoint.possibleOutcomes.length) {
        assumptions.push({
          description: `Possible outcomes for decision "${decisionPoint.condition}" are not specified.`,
          confidenceLevel: "low",
          source: "inference",
        });
      }

      if (!decisionPoint.riskLevel) {
        assumptions.push({
          description: `Risk level for decision "${decisionPoint.condition}" is not specified.`,
          confidenceLevel: "low",
          source: "inference",
        });
      }
    });

    if (!triggers || !triggers.length) {
      assumptions.push({
        description: "Process triggers are not specified.",
        confidenceLevel: "low",
        source: "inference",
      });
    }

    if (!outcomes || !outcomes.length) {
      assumptions.push({
        description: "Process outcomes are not specified.",
        confidenceLevel: "low",
        source: "inference",
      });
    }

    return assumptions;
  },
});

export default detectProcessAssumptionsTool;
