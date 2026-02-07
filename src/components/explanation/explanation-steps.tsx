"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useExplanationContext } from "./explanation-context";
import { ExplanationStep } from "./explanation-step";

export type ExplanationStepItem = {
  step: string;
  index: number;
};

export type ExplanationStepsRenderProps = {
  steps: ExplanationStepItem[];
};

export type ExplanationStepsProps = React.HTMLAttributes<HTMLOListElement> & {
  asChild?: boolean;
  children?:
    | React.ReactNode
    | ((props: ExplanationStepsRenderProps) => React.ReactNode);
};

export const ExplanationSteps = React.forwardRef<
  HTMLOListElement,
  ExplanationStepsProps
>(({ asChild, children, ...props }, ref) => {
  const { steps } = useExplanationContext();
  const Comp = asChild ? Slot : "ol";

  const items = React.useMemo<ExplanationStepItem[]>(
    () => steps.map((step, index) => ({ step, index })),
    [steps],
  );

  if (!items.length) {
    return null;
  }

  const content =
    typeof children === "function"
      ? children({ steps: items })
      : items.map((item) => (
          <ExplanationStep
            key={`${item.step}-${item.index}`}
            step={item.step}
            index={item.index}
          />
        ));

  return (
    <Comp ref={ref} data-step-count={items.length} {...props}>
      {content}
    </Comp>
  );
});

ExplanationSteps.displayName = "Explanation.Steps";
