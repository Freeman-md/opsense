import { z } from "zod";

export const modePickerSchema = z.object({
  title: z.string().optional().describe("Optional title for the picker."),
  options: z
    .array(
      z.object({
        id: z.string().describe("Stable identifier for the option."),
        label: z.string().describe("User-facing label for the option."),
        description: z
          .string()
          .optional()
          .describe("Optional helper text for the option."),
      }),
    )
    .optional()
    .describe("Options the user can select."),
  selectedOptionId: z
    .string()
    .optional()
    .describe("Currently selected option identifier, if any."),
  allowDeselect: z
    .boolean()
    .optional()
    .describe("Whether clicking the selected option clears the selection."),
});

export type ModePickerProps = z.infer<typeof modePickerSchema>;
