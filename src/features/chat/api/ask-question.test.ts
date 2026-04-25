import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {askQuestion} from "@/features/chat/api/ask-question";

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

function parseJsonRequestBody(body: BodyInit | null | undefined) {
  if (typeof body !== "string") {
    throw new Error("Expected a JSON string request body.");
  }

  return JSON.parse(body) as unknown;
}

describe("askQuestion", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_CHAT_API_URL", "https://example.com/functions");
    vi.stubEnv("VITE_CHAT_ASK_STREAM_PATH", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends the question payload and returns the parsed answer", async () => {
    const onToken = vi.fn();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      createStreamResponse([
        'event: token\ndata: {"token":"A parsed "}\n\n',
        'event: token\ndata: {"token":"answer"}\n\n',
        'event: done\ndata: {"answer":"A parsed answer"}\n\n'
      ])
    );

    const conversationHistory = [
      {role: "user" as const, content: "What was the previous role?"},
      {role: "assistant" as const, content: "It was Senior Software Engineer."}
    ];

    const answer = await askQuestion({
      conversationHistory,
      model: "openai/gpt-4o",
      onToken,
      question: "What does Erdogan do?",
      vectorData: [{pageContent: "profile"}]
    });

    expect(answer).toBe("A parsed answer");
    expect(onToken).toHaveBeenNthCalledWith(1, "A parsed ");
    expect(onToken).toHaveBeenNthCalledWith(2, "answer");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/functions/askCVQuestionStream",
      expect.objectContaining({
        method: "POST"
      })
    );
    expect(parseJsonRequestBody(fetchMock.mock.calls[0]?.[1]?.body)).toEqual(
      expect.objectContaining({
        conversationHistory,
        model: "openai/gpt-4o",
        question: "What does Erdogan do?"
      })
    );
  });

  it("uses the configured stream endpoint path when provided", async () => {
    vi.stubEnv("VITE_CHAT_ASK_STREAM_PATH", "askQuestionStream");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      createStreamResponse([
        'event: done\ndata: {"answer":"A local answer"}\n\n'
      ])
    );

    await expect(
      askQuestion({
        model: "openai/gpt-4o",
        question: "What does Erdogan do?",
        vectorData: [{pageContent: "profile"}]
      })
    ).resolves.toBe("A local answer");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/functions/askQuestionStream",
      expect.objectContaining({
        method: "POST"
      })
    );
  });

  it("throws a helpful error when the API url is missing", async () => {
    vi.stubEnv("VITE_CHAT_API_URL", "");

    await expect(
      askQuestion({
        model: "openai/gpt-4o",
        question: "Hello",
        vectorData: []
      })
    ).rejects.toThrow("VITE_CHAT_API_URL is not configured.");
  });
});
