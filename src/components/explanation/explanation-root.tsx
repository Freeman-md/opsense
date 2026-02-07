"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { z } from "zod";
import { ExplanationContext } from "./explanation-context";
import { ExplanationContent } from "./explanation-content";
import { ExplanationSteps } from "./explanation-steps";
import { ExplanationTrigger } from "./explanation-trigger";

export const explanationSchema = z.object({
  steps: z
    .array(z.string().describe("A single explanation step."))
    .optional()
    .describe("Explanation steps to render."),
  defaultOpen: z
    .boolean()
    .optional()
    .describe("Whether the explanation is expanded by default."),
});

export type ExplanationRootProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  defaultOpen?: boolean;
  steps?: string[];
};

export const ExplanationRoot = React.forwardRef<
  HTMLDivElement,
  ExplanationRootProps
>(({ asChild, defaultOpen = false, steps, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const stepList = steps ?? [];
  const Comp = asChild ? Slot : "div";

  const content =
    children ?? (
      <>
        <ExplanationTrigger>Toggle explanation</ExplanationTrigger>
        <ExplanationContent>
          <ExplanationSteps />
        </ExplanationContent>
      </>
    );

  return (
    <ExplanationContext.Provider
      value={{
        isOpen,
        setOpen: setIsOpen,
        toggle: () => setIsOpen((prev) => !prev),
        steps: stepList,
      }}
    >
      <Comp ref={ref} data-state={isOpen ? "open" : "closed"} {...props}>
        {content}
      </Comp>
    </ExplanationContext.Provider>
  );
});

ExplanationRoot.displayName = "Explanation.Root";
