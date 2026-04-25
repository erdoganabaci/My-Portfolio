import {z} from "zod";
import {getChatApiUrl} from "@/features/chat/api/chat-api-url";

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

type AskQuestionInput = {
  model: string;
  question: string;
  vectorData: unknown;
};

export async function askQuestion({
  model,
  question,
  vectorData
}: AskQuestionInput) {
  const response = await fetch(getChatApiUrl("/askCVQuestion"), {
    body: JSON.stringify({
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

  const parsedResponse = responseSchema.parse(await response.json());

  return parsedResponse.answer ?? parsedResponse.text ?? "";
}
