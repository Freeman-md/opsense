"use client";

import { z } from "zod";
import * as React from "react";

export const processSummarySchema = z.object({
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
});

export type ProcessSummaryProps = z.infer<typeof processSummarySchema>;

export const ProcessSummary: React.FC<ProcessSummaryProps> = ({
  processModel,
}) => {
  const activities = processModel?.activities ?? [];
  const decisionPoints = processModel?.decisionPoints ?? [];
  const triggers = processModel?.triggers ?? [];
  const outcomes = processModel?.outcomes ?? [];

  const hasContent =
    activities.length ||
    decisionPoints.length ||
    triggers.length ||
    outcomes.length;

  if (!hasContent) {
    return null;
  }

  return (
    <section className="w-full rounded-lg border border-border bg-card p-4 text-foreground space-y-4">
      <header>
        <h3 className="text-base font-semibold">Process Summary</h3>
      </header>

      {triggers.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">
            Triggers
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            {triggers.map((trigger, index) => (
              <li key={`${trigger}-${index}`} className="text-foreground">
                {trigger}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activities.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">
            Activities
          </h4>
          <ul className="mt-2 space-y-2 text-sm">
            {activities.map((activity, index) => (
              <li
                key={`${activity.name}-${index}`}
                className="rounded-md border border-border/60 bg-background p-2"
              >
                <div className="font-medium text-foreground">
                  {activity.name}
                </div>
                {(activity.frequency || activity.manualOrAutomated) && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {activity.frequency && (
                      <span>Frequency: {activity.frequency}</span>
                    )}
                    {activity.frequency && activity.manualOrAutomated && (
                      <span className="px-1">•</span>
                    )}
                    {activity.manualOrAutomated && (
                      <span>Status: {activity.manualOrAutomated}</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {decisionPoints.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">
            Decision Points
          </h4>
          <ul className="mt-2 space-y-2 text-sm">
            {decisionPoints.map((decisionPoint, index) => (
              <li
                key={`${decisionPoint.condition}-${index}`}
                className="rounded-md border border-border/60 bg-background p-2"
              >
                <div className="font-medium text-foreground">
                  {decisionPoint.condition}
                </div>
                {decisionPoint.riskLevel && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Risk level: {decisionPoint.riskLevel}
                  </div>
                )}
                {decisionPoint.possibleOutcomes.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-foreground">
                    {decisionPoint.possibleOutcomes.map((outcome, outcomeIndex) => (
                      <li key={`${outcome}-${outcomeIndex}`}>{outcome}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {outcomes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground">
            Outcomes
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            {outcomes.map((outcome, index) => (
              <li key={`${outcome}-${index}`} className="text-foreground">
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

ProcessSummary.displayName = "ProcessSummary";
