import { defineTool } from "@tambo-ai/react";
import { z } from "zod";
import { getClarificationDecision } from "@/domain/clarification";

const getClarificationDecisionTool = defineTool({
  name: "getClarificationDecision",
  description:
    "Determine whether clarification questions are needed based on a process model and assumptions.",
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
  outputSchema: z.object({
    shouldAsk: z
      .boolean()
      .describe("Whether clarification questions are required."),
    questions: z
      .array(z.string())
      .describe("Neutral clarification questions to ask the user."),
    reason: z
      .string()
      .describe("One-sentence reason for the clarification decision."),
  }),
  tool: ({ processModel, assumptions }) =>
    getClarificationDecision({ processModel, assumptions }),
});

export default getClarificationDecisionTool;
