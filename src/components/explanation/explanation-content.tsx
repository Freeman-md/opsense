"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useExplanationContext } from "./explanation-context";

export type ExplanationContentRenderProps = {
  isOpen: boolean;
  steps: string[];
};

export type ExplanationContentProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  forceMount?: boolean;
  children?:
    | React.ReactNode
    | ((props: ExplanationContentRenderProps) => React.ReactNode);
};

export const ExplanationContent = React.forwardRef<
  HTMLDivElement,
  ExplanationContentProps
>(({ asChild, forceMount = false, children, ...props }, ref) => {
  const { isOpen, steps } = useExplanationContext();
  const Comp = asChild ? Slot : "div";

  if (!forceMount && !isOpen) {
    return null;
  }

  const content =
    typeof children === "function" ? children({ isOpen, steps }) : children;

  return (
    <Comp
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      hidden={!isOpen && forceMount}
      {...props}
    >
      {content}
    </Comp>
  );
});

ExplanationContent.displayName = "Explanation.Content";
