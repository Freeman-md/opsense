"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { z } from "zod";
import { ExplanationContext } from "./explanation-context";

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
        {children}
      </Comp>
    </ExplanationContext.Provider>
  );
});

ExplanationRoot.displayName = "Explanation.Root";
