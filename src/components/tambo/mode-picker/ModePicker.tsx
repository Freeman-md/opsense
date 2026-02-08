"use client";

import * as React from "react";
import { withInteractable, useTamboComponentState } from "@tambo-ai/react";
import { cn } from "@/lib/utils";
import { modePickerSchema, type ModePickerProps } from "./ModePicker.schema";

type ModePickerState = {
  selectedOptionId?: string;
};

const ModePickerBase: React.FC<ModePickerProps> = ({
  title,
  options,
  selectedOptionId,
  allowDeselect = false,
}) => {
  const [state, setState] = useTamboComponentState<ModePickerState>(
    "mode-picker",
    {
      selectedOptionId: undefined,
    },
  );
  const lastPropSelectionRef = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (
      selectedOptionId !== undefined &&
      selectedOptionId !== lastPropSelectionRef.current
    ) {
      lastPropSelectionRef.current = selectedOptionId;
      if (state?.selectedOptionId !== selectedOptionId) {
        setState({ selectedOptionId });
      }
    }

    if (selectedOptionId === undefined) {
      lastPropSelectionRef.current = undefined;
    }
  }, [selectedOptionId, setState, state?.selectedOptionId]);

  const optionList = options ?? [];
  const activeOptionId = state?.selectedOptionId ?? selectedOptionId;

  const handleSelect = (optionId: string) => {
    if (!setState) return;
    if (optionId === activeOptionId) {
      if (allowDeselect) {
        setState({ selectedOptionId: undefined });
      }
      return;
    }
    setState({ selectedOptionId: optionId });
  };

  if (!title && optionList.length === 0) {
    return null;
  }

  return (
    <div className="w-full rounded-lg border border-border bg-card p-4 space-y-3">
      {title && <h3 className="text-base font-semibold">{title}</h3>}

      {optionList.length === 0 ? (
        <p className="text-sm text-muted-foreground">Options will appear here.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {optionList.map((option) => {
            const isSelected = option.id === activeOptionId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "w-full text-left rounded-md border px-3 py-2 transition-colors",
                  "border-border bg-background hover:bg-muted/40",
                  isSelected && "border-foreground/20 bg-muted",
                )}
                aria-pressed={isSelected}
              >
                <div className="font-medium text-sm text-foreground">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const InteractableModePicker = withInteractable(ModePickerBase, {
  componentName: "ModePicker",
  description:
    "A selectable list of options for choosing a mode or next step. Use when you want the user to pick from provided options.",
  propsSchema: modePickerSchema,
});

InteractableModePicker.displayName = "InteractableModePicker";
