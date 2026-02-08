"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useExplanationContext } from "./explanation-context";

export type ExplanationTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

export const ExplanationTrigger = React.forwardRef<
  HTMLButtonElement,
  ExplanationTriggerProps
>(({ asChild, onClick, ...props }, ref) => {
  const { isOpen, toggle } = useExplanationContext();
  const Comp = asChild ? Slot : "button";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    toggle();
  };

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : "button"}
      data-state={isOpen ? "open" : "closed"}
      onClick={handleClick}
      {...props}
    />
  );
});

ExplanationTrigger.displayName = "Explanation.Trigger";
