import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

const interpretProcessModelTool = defineTool({
  name: "interpretProcessModel",
  description:
    "Interpret free-text descriptions of work into a structured process model without making automation decisions.",
  inputSchema: z.object({
    rawText: z
      .string()
      .describe("Free-text description of work, tasks, or a problem."),
  }),
  outputSchema: z.object({
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
      .describe("List of activities extracted directly from the input."),
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
      .describe("Decision points explicitly described in the input."),
    triggers: z
      .array(z.string())
      .optional()
      .describe("Triggers that start the process if explicitly stated."),
    outcomes: z
      .array(z.string())
      .optional()
      .describe("Outcomes or results if explicitly stated."),
  }),
  tool: ({ rawText }) => {
    const lines = rawText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const activities = lines.map((line) => ({ name: line }));

    return {
      activities,
      decisionPoints: [],
      triggers: [],
      outcomes: [],
    };
  },
});

export default interpretProcessModelTool;
