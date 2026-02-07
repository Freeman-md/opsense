/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { defineTool, TamboTool } from "@tambo-ai/react";
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

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  interpretProcessModelTool,
  detectProcessAssumptionsTool,
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // Add more components here
];
