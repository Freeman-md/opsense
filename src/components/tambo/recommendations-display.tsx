"use client";

import * as React from "react";
import { z } from "zod";

export const recommendationsDisplaySchema = z.object({
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
    .optional()
    .describe("Automation recommendations to display."),
});

export type RecommendationsDisplayProps = z.infer<
  typeof recommendationsDisplaySchema
>;

const recommendationMeta = {
  automate: {
    label: "Automate",
    riskLabel: "Low risk",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    riskClass: "bg-green-50 text-green-700 border-green-200",
  },
  caution: {
    label: "Caution",
    riskLabel: "Medium risk",
    badgeClass: "bg-yellow-100 text-yellow-700 border-yellow-200",
    riskClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  do_not_automate: {
    label: "Do not automate",
    riskLabel: "High risk",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    riskClass: "bg-red-50 text-red-700 border-red-200",
  },
} as const;

export const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = ({
  recommendations,
}) => {
  const recommendationList = recommendations ?? [];

  if (!recommendationList.length) {
    return null;
  }

  return (
    <section className="w-full rounded-lg border border-border bg-card p-4 text-foreground space-y-4">
      <header>
        <h3 className="text-base font-semibold">Recommendations</h3>
      </header>

      <ul className="space-y-3 text-sm">
        {recommendationList.map((recommendation, index) => {
          if (!recommendation?.recommendationType) {
            return null;
          }

          const meta = recommendationMeta[recommendation.recommendationType];

          return (
            <li
              key={`${recommendation.target ?? "recommendation"}-${index}`}
              className="rounded-md border border-border/60 bg-background p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  {recommendation.target && (
                    <p className="text-foreground font-medium">
                      {recommendation.target}
                    </p>
                  )}
                  {recommendation.rationale && (
                    <p className="text-xs text-muted-foreground">
                      {recommendation.rationale}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.badgeClass}`}
                  >
                    {meta.label}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.riskClass}`}
                  >
                    {meta.riskLabel}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

RecommendationsDisplay.displayName = "RecommendationsDisplay";
