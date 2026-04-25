import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {getAvailableModels} from "@/features/chat/api/get-available-models";

describe("getAvailableModels", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_CHAT_API_URL", "https://example.com/functions");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("loads available models from the chat API base url", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          models: [{id: "openai/gpt-4o", name: "GPT-4o"}]
        }),
        {status: 200}
      )
    );

    await expect(getAvailableModels()).resolves.toEqual([
      {id: "openai/gpt-4o", name: "GPT-4o"}
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/functions/getAvailableModels"
    );
  });

  it("supports OpenRouter-style data payloads", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [{id: "anthropic/claude-3.5-sonnet"}]
        }),
        {status: 200}
      )
    );

    await expect(getAvailableModels()).resolves.toEqual([
      {
        id: "anthropic/claude-3.5-sonnet",
        name: "anthropic/claude-3.5-sonnet"
      }
    ]);
  });

  it("throws a helpful error when the API url is missing", async () => {
    vi.stubEnv("VITE_CHAT_API_URL", "");

    await expect(getAvailableModels()).rejects.toThrow(
      "VITE_CHAT_API_URL is not configured."
    );
  });
});
