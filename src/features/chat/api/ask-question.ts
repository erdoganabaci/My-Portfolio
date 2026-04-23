import {z} from "zod";

const envSchema = z.object({
  VITE_CHAT_API_URL: z.string().url()
});

const responseSchema = z
  .object({
    answer: z.string().optional(),
    text: z.string().optional()
  })
  .refine(
    response => typeof response.answer === "string" || typeof response.text === "string",
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
  const parsedEnv = envSchema.safeParse(import.meta.env);

  if (!parsedEnv.success) {
    throw new Error("VITE_CHAT_API_URL is not configured.");
  }

  const response = await fetch(parsedEnv.data.VITE_CHAT_API_URL, {
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
