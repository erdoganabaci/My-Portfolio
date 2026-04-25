import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {ChatRoute} from "@/features/chat/routes/chat-route";
import {renderWithProviders} from "@/testing/render";

const modelPayload = {
  models: [{id: "openai/gpt-4o", name: "GPT-4o"}]
};

function getFetchUrl(input: RequestInfo | URL) {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  return input.url;
}

describe("ChatRoute", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_CHAT_API_URL", "https://example.com/functions");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("shows loading state and appends the assistant response", async () => {
    const user = userEvent.setup();
    let resolveResponse: ((value: Response) => void) | null = null;

    vi.spyOn(globalThis, "fetch").mockImplementation(input => {
      if (getFetchUrl(input).endsWith("/getAvailableModels")) {
        return Promise.resolve(
          new Response(JSON.stringify(modelPayload), {status: 200})
        );
      }

      return new Promise(resolve => {
        resolveResponse = resolve;
      });
    });

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    expect(
      await screen.findByRole("button", {name: /gpt-4o/i})
    ).toBeInTheDocument();

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

  it("renders models returned by the chat API in the picker", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          models: [{id: "remote/model", name: "Remote Model"}]
        }),
        {status: 200}
      )
    );

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    await user.click(
      await screen.findByRole("button", {name: /remote model/i})
    );

    expect(screen.getAllByRole("button", {name: /remote model/i})).toHaveLength(
      2
    );
  });

  it("shows a useful error when the env is missing", async () => {
    vi.stubEnv("VITE_CHAT_API_URL", "");

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    expect(
      await screen.findByText("VITE_CHAT_API_URL is not configured.")
    ).toBeInTheDocument();
  });

  it("shows a useful error when models cannot be loaded", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, {status: 500})
    );

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    await waitFor(() =>
      expect(
        screen.getByText("Failed to load available chat models.")
      ).toBeInTheDocument()
    );
  });
});
