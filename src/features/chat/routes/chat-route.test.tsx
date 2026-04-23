import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {ChatRoute} from "@/features/chat/routes/chat-route";
import {renderWithProviders} from "@/testing/render";

describe("ChatRoute", () => {
  beforeEach(() => {
    vi.stubEnv(
      "VITE_CHAT_API_URL",
      "https://example.com/functions/askCVQuestion"
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("shows loading state and appends the assistant response", async () => {
    const user = userEvent.setup();
    let resolveResponse: ((value: Response) => void) | null = null;

    vi.spyOn(globalThis, "fetch").mockImplementation(
      () =>
        new Promise(resolve => {
          resolveResponse = resolve;
        })
    );

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    await user.type(
      screen.getByPlaceholderText(
        "Ask about Erdogan's experience, education, skills, or projects..."
      ),
      "What does Erdogan do?"
    );
    await user.click(screen.getByRole("button", {name: /send/i}));

    expect(screen.getByText("Thinking...")).toBeInTheDocument();

    await waitFor(() => {
      expect(resolveResponse).not.toBeNull();
    });

    resolveResponse?.(
      new Response(
        JSON.stringify({answer: "Erdogan works across frontend and backend."}),
        {
          status: 200
        }
      )
    );

    await waitFor(() => {
      expect(
        screen.getByText("Erdogan works across frontend and backend.")
      ).toBeInTheDocument();
    });
  });

  it("shows a useful error when the env is missing", async () => {
    const user = userEvent.setup();

    vi.unstubAllEnvs();

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    await user.click(
      screen.getByRole("button", {
        name: "Summarize Erdogan's education."
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText("VITE_CHAT_API_URL is not configured.")
      ).toBeInTheDocument();
    });
  });
});
