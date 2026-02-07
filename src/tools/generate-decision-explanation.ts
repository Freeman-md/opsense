import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

const generateDecisionExplanationTool = defineTool({
  name: "generateDecisionExplanation",
  description:
    "Generate plain-language explanations for recommendations using provided assumptions.",
  inputSchema: z.object({
    recommendations: z
      .array(
        z.object({
          target: z
            .string()
            .describe("The activity or decision being evaluated."),
          recommendationType: z
            .enum(["automate", "caution", "do_not_automate"])
            .describe("Recommended automation stance for the target."),
          rationale: z
            .string()
            .describe("Short, factual justification tied to decision rules."),
        }),
      )
      .describe("List of recommendations to explain."),
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
      .describe("Assumptions that may affect the recommendations."),
  }),
  outputSchema: z
    .array(
      z
        .string()
        .describe("Plain-language explanation of a recommendation."),
    )
    .describe("Explanation blocks for each recommendation."),
  tool: ({ recommendations, assumptions }) => {
    if (!recommendations.length) {
      return [];
    }

    return recommendations.map((recommendation) => {
      const baseExplanation = `Recommendation for ${recommendation.target}: ${recommendation.recommendationType}. Rationale: ${recommendation.rationale}.`;

      if (!assumptions.length) {
        return baseExplanation;
      }

      const assumptionText = assumptions
        .map(
          (assumption) =>
            `${assumption.description} (confidence: ${assumption.confidenceLevel}, source: ${assumption.source})`,
        )
        .join("; ");

      return `${baseExplanation} Assumptions: ${assumptionText}.`;
    });
  },
});

export default generateDecisionExplanationTool;
