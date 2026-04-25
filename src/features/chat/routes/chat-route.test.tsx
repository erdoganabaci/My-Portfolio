import {act, fireEvent, screen, waitFor} from "@testing-library/react";
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

function createStreamResponse(events: string[]) {
  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        for (const event of events) {
          controller.enqueue(encoder.encode(event));
        }

        controller.close();
      }
    }),
    {
      headers: {
        "Content-Type": "text/event-stream"
      },
      status: 200
    }
  );
}

function createControlledStreamResponse() {
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
  const encoder = new TextEncoder();

  return {
    close() {
      controller?.close();
    },
    enqueue(event: string) {
      controller?.enqueue(encoder.encode(event));
    },
    response: new Response(
      new ReadableStream({
        start(nextController) {
          controller = nextController;
        }
      }),
      {
        headers: {
          "Content-Type": "text/event-stream"
        },
        status: 200
      }
    )
  };
}

function parseJsonRequestBody(body: BodyInit | null | undefined) {
  if (typeof body !== "string") {
    throw new Error("Expected a JSON string request body.");
  }

  return JSON.parse(body) as unknown;
}

function setScrollMetrics(
  element: HTMLElement,
  metrics: {clientHeight: number; scrollHeight: number; scrollTop: number}
) {
  Object.defineProperties(element, {
    clientHeight: {
      configurable: true,
      value: metrics.clientHeight
    },
    scrollHeight: {
      configurable: true,
      value: metrics.scrollHeight
    },
    scrollTop: {
      configurable: true,
      value: metrics.scrollTop,
      writable: true
    }
  });
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
      createStreamResponse([
        'event: token\ndata: {"token":"Erdogan works across "}\n\n',
        'event: token\ndata: {"token":"frontend and backend."}\n\n',
        'event: done\ndata: {"answer":"Erdogan works across frontend and backend."}\n\n'
      ])
    );

    await waitFor(() => {
      expect(
        screen.getByText("Erdogan works across frontend and backend.")
      ).toBeInTheDocument();
    });
  });

  it("sends the previous completed turn as follow-up context", async () => {
    const user = userEvent.setup();
    const requestBodies: unknown[] = [];

    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      if (getFetchUrl(input).endsWith("/getAvailableModels")) {
        return Promise.resolve(
          new Response(JSON.stringify(modelPayload), {status: 200})
        );
      }

      requestBodies.push(parseJsonRequestBody(init?.body));

      return Promise.resolve(
        createStreamResponse([
          `event: done\ndata: {"answer":"Answer ${requestBodies.length}"}\n\n`
        ])
      );
    });

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    await screen.findByRole("button", {name: /gpt-4o/i});

    const input = screen.getByPlaceholderText(
      "Ask about Erdogan's experience, education, skills, or projects..."
    );

    await user.type(input, "What is the recent role?");
    await user.click(screen.getByRole("button", {name: /send/i}));
    await screen.findByText("Answer 1");

    await user.type(input, "What about that company?");
    await user.click(screen.getByRole("button", {name: /send/i}));
    await screen.findByText("Answer 2");

    await waitFor(() => {
      expect(requestBodies).toHaveLength(2);
    });
    expect(requestBodies[1]).toEqual(
      expect.objectContaining({
        conversationHistory: [
          {role: "user", content: "What is the recent role?"},
          {role: "assistant", content: "Answer 1"}
        ],
        question: "What about that company?"
      })
    );
  });

  it("does not force the message list to the bottom while the user is reading earlier messages", async () => {
    const user = userEvent.setup();
    const stream = createControlledStreamResponse();

    vi.spyOn(globalThis, "fetch").mockImplementation(input => {
      if (getFetchUrl(input).endsWith("/getAvailableModels")) {
        return Promise.resolve(
          new Response(JSON.stringify(modelPayload), {status: 200})
        );
      }

      return Promise.resolve(stream.response);
    });

    renderWithProviders(<ChatRoute />, {route: "/chat"});

    await screen.findByRole("button", {name: /gpt-4o/i});

    const messagesList = screen.getByLabelText("Chat messages");
    setScrollMetrics(messagesList, {
      clientHeight: 400,
      scrollHeight: 1000,
      scrollTop: 600
    });

    await user.type(
      screen.getByPlaceholderText(
        "Ask about Erdogan's experience, education, skills, or projects..."
      ),
      "What does Erdogan do?"
    );
    await user.click(screen.getByRole("button", {name: /send/i}));

    await screen.findByText("Thinking...");
    await waitFor(() => expect(messagesList.scrollTop).toBe(1000));

    messagesList.scrollTop = 100;
    fireEvent.scroll(messagesList);

    act(() => {
      stream.enqueue('event: token\ndata: {"token":"Partial"}\n\n');
    });

    await screen.findByText("Partial");
    await waitFor(() => expect(messagesList.scrollTop).toBe(100));

    messagesList.scrollTop = 600;
    fireEvent.scroll(messagesList);

    act(() => {
      stream.enqueue('event: token\ndata: {"token":" answer"}\n\n');
    });

    await screen.findByText("Partial answer");
    await waitFor(() => expect(messagesList.scrollTop).toBe(1000));

    act(() => {
      stream.enqueue(
        'event: done\ndata: {"answer":"Partial answer"}\n\n'
      );
      stream.close();
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
