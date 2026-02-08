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
import { InteractableModePicker } from "@/components/tambo/mode-picker/ModePicker";
import { modePickerSchema } from "@/components/tambo/mode-picker/ModePicker.schema";
import {
  AssumptionsDisplay,
  assumptionsDisplaySchema,
} from "@/components/tambo/assumptions-display";
import {
  ExplanationRoot,
  explanationSchema,
} from "@/components/tambo/explanation/explanation-root";
import {
  ProcessSummary,
  processSummarySchema,
} from "@/components/tambo/process-summary";
import {
  RecommendationsDisplay,
  recommendationsDisplaySchema,
} from "@/components/tambo/recommendations-display";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import analyzeAutomationSuitabilityTool from "@/tools/analyze-automation-suitability";
import detectProcessAssumptionsTool from "@/tools/detect-process-assumptions";
import getClarificationDecisionTool from "@/tools/get-clarification-decision";
import generateDecisionExplanationTool from "@/tools/generate-decision-explanation";
import interpretProcessModelTool from "@/tools/interpret-process-model";

import type { TamboComponent, TamboTool } from "@tambo-ai/react";

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
  getClarificationDecisionTool,
  analyzeAutomationSuitabilityTool,
  generateDecisionExplanationTool,
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
    name: "ProcessSummary",
    description:
      "A read-only summary of a structured process model including activities, decision points, triggers, and outcomes.",
    component: ProcessSummary,
    propsSchema: processSummarySchema,
  },
  {
    name: "Explanation",
    description:
      "Displays explanation steps with expandable and collapsible content.",
    component: ExplanationRoot,
    propsSchema: explanationSchema,
  },
  {
    name: "AssumptionsDisplay",
    description:
      "A read-only list of assumptions with visible confidence indicators.",
    component: AssumptionsDisplay,
    propsSchema: assumptionsDisplaySchema,
  },
  {
    name: "RecommendationsDisplay",
    description:
      "A read-only list of recommendations with visible recommendation type and risk.",
    component: RecommendationsDisplay,
    propsSchema: recommendationsDisplaySchema,
  },
  {
    name: "ModePicker",
    description:
      "Selectable list of options for choosing a mode or next step. Use to let the user pick from provided options.",
    component: InteractableModePicker,
    propsSchema: modePickerSchema,
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
