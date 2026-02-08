import { ExplanationRoot } from "./explanation-root";
import { ExplanationTrigger } from "./explanation-trigger";
import { ExplanationContent } from "./explanation-content";
import { ExplanationSteps } from "./explanation-steps";
import { ExplanationStep } from "./explanation-step";

export const Explanation = {
  Root: ExplanationRoot,
  Trigger: ExplanationTrigger,
  Content: ExplanationContent,
  Steps: ExplanationSteps,
  Step: ExplanationStep,
};

export type { ExplanationRootProps } from "./explanation-root";
export type {
  ExplanationContentProps,
  ExplanationContentRenderProps,
} from "./explanation-content";
export type {
  ExplanationStepsProps,
  ExplanationStepsRenderProps,
  ExplanationStepItem,
} from "./explanation-steps";
export type { ExplanationStepProps } from "./explanation-step";
