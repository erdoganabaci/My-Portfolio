import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {askQuestion} from "@/features/chat/api/ask-question";

describe("askQuestion", () => {
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

  it("sends the question payload and returns the parsed answer", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({answer: "A parsed answer"}), {
          status: 200
        })
      );

    const answer = await askQuestion({
      model: "openai/gpt-4o",
      question: "What does Erdogan do?",
      vectorData: [{pageContent: "profile"}]
    });

    expect(answer).toBe("A parsed answer");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/functions/askCVQuestion",
      expect.objectContaining({
        method: "POST"
      })
    );
  });

  it("throws a helpful error when the API url is missing", async () => {
    vi.unstubAllEnvs();

    await expect(
      askQuestion({
        model: "openai/gpt-4o",
        question: "Hello",
        vectorData: []
      })
    ).rejects.toThrow("VITE_CHAT_API_URL is not configured.");
  });
});
