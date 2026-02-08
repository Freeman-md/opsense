"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

export type ExplanationStepProps = React.HTMLAttributes<HTMLLIElement> & {
  asChild?: boolean;
  step: string;
  index?: number;
};

export const ExplanationStep = React.forwardRef<
  HTMLLIElement,
  ExplanationStepProps
>(({ asChild, step, index, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "li";

  return (
    <Comp ref={ref} data-step-index={index} {...props}>
      {children ?? step}
    </Comp>
  );
});

ExplanationStep.displayName = "Explanation.Step";
