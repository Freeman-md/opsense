import * as React from "react";

export type ExplanationContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  steps: string[];
};

const ExplanationContext = React.createContext<ExplanationContextValue | null>(
  null,
);

export function useExplanationContext() {
  const context = React.useContext(ExplanationContext);
  if (!context) {
    throw new Error("Explanation parts must be used within Explanation.Root");
  }
  return context;
}

export { ExplanationContext };
