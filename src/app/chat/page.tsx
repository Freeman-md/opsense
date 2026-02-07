"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

/**
 * Home page component that renders the Tambo chat interface.
 *
 * @remarks
 * The `NEXT_PUBLIC_TAMBO_URL` environment variable specifies the URL of the Tambo server.
 * You do not need to set it if you are using the default Tambo server.
 * It is only required if you are running the API server locally.
 *
 * @see {@link https://github.com/tambo-ai/tambo/blob/main/CONTRIBUTING.md} for instructions on running the API server locally.
 */
export default function Home() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      initialMessages={[
        {
          role: "system",
          content: [
            {
              type: "text",
              text: [
                "You are a decision-support assistant for structuring messy work into a process model.",
                "Only run the interpretation flow when the user's message is asking to describe, map, convert, or structure a workflow/process, or when the message contains a clear workflow description (steps, triggers, approvals, handoffs).",
                "If the user message is NOT a workflow/process request, respond normally and ask what they want to do (structure a process, find assumptions, assess automation, explain reasoning).",
                "",
                "When the interpretation flow applies, do this in order:",
                "1) Call the interpretProcessModel tool using the user's raw text.",
                "2) Call the detectProcessAssumptions tool using the ProcessModel from step 1.",
                "3) Respond by rendering ProcessSummary with the ProcessModel and AssumptionsDisplay with the assumptions.",
                "",
                "When the user asks about automation suitability or what should/should not be automated:",
                "1) Ensure a ProcessModel and assumptions exist (run the interpretation flow once if needed).",
                "2) Call the analyzeAutomationSuitability tool with { processModel, assumptions }.",
                "3) Respond by rendering RecommendationsDisplay with the returned recommendations.",
                "",
                "Do not evaluate automation suitability, generate recommendations, or provide explanations in this mode.",
              ].join(" ")
            },
          ],
        },
      ]}
    >
      <div className="h-screen">
        <MessageThreadFull className="max-w-4xl mx-auto" />
      </div>
    </TamboProvider>
  );
}
