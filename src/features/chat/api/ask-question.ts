import {z} from "zod";
import {getAskQuestionStreamUrl} from "@/features/chat/api/chat-api-url";
import type {ConversationHistoryMessage} from "@/features/chat/types";

const responseSchema = z
  .object({
    answer: z.string().optional(),
    text: z.string().optional()
  })
  .refine(
    response =>
      typeof response.answer === "string" || typeof response.text === "string",
    {
      message: "Chat API returned an invalid response payload."
    }
  );

const tokenEventSchema = z.object({
  token: z.string()
});

const doneEventSchema = z.object({
  answer: z.string()
});

const errorEventSchema = z.object({
  error: z.string()
});

type AskQuestionInput = {
  conversationHistory?: ConversationHistoryMessage[];
  model: string;
  onToken?: (token: string) => void;
  question: string;
  vectorData: unknown;
};

export async function askQuestion({
  conversationHistory = [],
  model,
  onToken,
  question,
  vectorData
}: AskQuestionInput) {
  const response = await fetch(getAskQuestionStreamUrl(), {
    body: JSON.stringify({
      conversationHistory,
      model,
      question,
      vectorData
    }),
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Failed to get an answer from the chat service.");
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  if (response.body && contentType.includes("text/event-stream")) {
    return readAnswerStream(response.body, onToken);
  }

  const parsedResponse = responseSchema.parse(await response.json());

  return parsedResponse.answer ?? parsedResponse.text ?? "";
}

async function readAnswerStream(
  body: ReadableStream<Uint8Array>,
  onToken?: (token: string) => void
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";

  try {
    while (true) {
      const {done, value} = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, {stream: true});
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? "";

      for (const eventText of events) {
        const event = parseSseEvent(eventText);
        if (!event) {
          continue;
        }

        const eventAnswer = handleStreamEvent(event, token => {
          answer += token;
          onToken?.(token);
        });

        if (eventAnswer !== null) {
          answer = eventAnswer;
        }
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      const event = parseSseEvent(buffer);
      if (event) {
        const eventAnswer = handleStreamEvent(event, token => {
          answer += token;
          onToken?.(token);
        });

        if (eventAnswer !== null) {
          answer = eventAnswer;
        }
      }
    }

    return answer;
  } finally {
    reader.releaseLock();
  }
}

function parseSseEvent(eventText: string) {
  const lines = eventText.split(/\r?\n/);
  const eventLine = lines.find(line => line.startsWith("event:"));
  const data = lines
    .filter(line => line.startsWith("data:"))
    .map(line => line.slice("data:".length).trim())
    .join("\n");

  if (!data) {
    return null;
  }

  return {
    event: eventLine?.slice("event:".length).trim() ?? "message",
    data
  };
}

function handleStreamEvent(
  event: {event: string; data: string},
  onToken: (token: string) => void
) {
  if (event.event === "token") {
    const {token} = tokenEventSchema.parse(JSON.parse(event.data));
    onToken(token);
    return null;
  }

  if (event.event === "done") {
    return doneEventSchema.parse(JSON.parse(event.data)).answer;
  }

  if (event.event === "error") {
    throw new Error(errorEventSchema.parse(JSON.parse(event.data)).error);
  }

  return null;
}
