import {render, screen} from "@testing-library/react";
import {RouterProvider} from "react-router-dom";
import {afterEach, describe, expect, it, vi} from "vitest";
import {createTestRouter} from "@/app/router";
import {AppProvider} from "@/app/providers/app-provider";

describe("app router", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("renders the portfolio route on /", async () => {
    render(
      <AppProvider>
        <RouterProvider router={createTestRouter(["/"])} />
      </AppProvider>
    );

    expect(
      await screen.findByRole("heading", {name: /Hi all, I'm Erdogan/i})
    ).toBeInTheDocument();
  });

  it("renders the chat route on /chat", async () => {
    vi.stubEnv("VITE_CHAT_API_URL", "https://example.com/functions");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          models: [{id: "openai/gpt-4o", name: "GPT-4o"}]
        }),
        {status: 200}
      )
    );

    render(
      <AppProvider>
        <RouterProvider router={createTestRouter(["/chat"])} />
      </AppProvider>
    );

    expect(
      await screen.findByRole("heading", {name: "Chat with Erdogan's profile"})
    ).toBeInTheDocument();
  });
});
