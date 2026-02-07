"use client";

import { z } from "zod";
import * as React from "react";

export const assumptionsDisplaySchema = z.object({
  assumptions: z
    .array(
      z.object({
        description: z
          .string()
          .describe("The assumption or uncertainty found."),
        confidenceLevel: z
          .enum(["low", "medium", "high"])
          .optional()
          .describe("Confidence level if provided."),
        source: z
          .enum(["input", "inference"])
          .optional()
          .describe("Whether the assumption comes from input or inference."),
      }),
    )
    .optional()
    .describe("Assumptions to display."),
});

export type AssumptionsDisplayProps = z.infer<typeof assumptionsDisplaySchema>;

const getConfidenceBadge = (
  confidenceLevel: "low" | "medium" | "high" | undefined,
) => {
  switch (confidenceLevel) {
    case "low":
      return {
        label: "Low confidence",
        className: "bg-red-100 text-red-700 border-red-200",
      };
    case "medium":
      return {
        label: "Medium confidence",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      };
    case "high":
      return {
        label: "High confidence",
        className: "bg-green-100 text-green-700 border-green-200",
      };
    default:
      return {
        label: "Confidence pending",
        className: "bg-muted text-muted-foreground border-border",
      };
  }
};

export const AssumptionsDisplay: React.FC<AssumptionsDisplayProps> = ({
  assumptions,
}) => {
  const assumptionList = assumptions ?? [];

  if (!assumptionList.length) {
    return null;
  }

  return (
    <section className="w-full rounded-lg border border-border bg-card p-4 text-foreground space-y-4">
      <header>
        <h3 className="text-base font-semibold">Assumptions & Uncertainty</h3>
      </header>

      <ul className="space-y-2 text-sm">
        {assumptionList.map((assumption, index) => {
          if (!assumption?.description) {
            return null;
          }

          const badge = getConfidenceBadge(assumption.confidenceLevel);

          return (
            <li
              key={`${assumption.description}-${index}`}
              className="rounded-md border border-border/60 bg-background p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-foreground">{assumption.description}</p>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>
              {assumption.source && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Source: {assumption.source}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

AssumptionsDisplay.displayName = "AssumptionsDisplay";
