import {z} from "zod";

const defaultAskQuestionStreamPath = "/askCVQuestionStream" satisfies `/${string}`;

const envSchema = z.object({
  VITE_CHAT_API_URL: z.string().url(),
  VITE_CHAT_ASK_STREAM_PATH: z.string().optional()
});

export function getChatApiUrl(path: `/${string}`) {
  const parsedEnv = envSchema.safeParse(import.meta.env);

  if (!parsedEnv.success) {
    throw new Error("VITE_CHAT_API_URL is not configured.");
  }

  const baseUrl = parsedEnv.data.VITE_CHAT_API_URL.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return new URL(normalizedPath, `${baseUrl}/`).toString();
}

export function getAskQuestionStreamUrl() {
  const parsedEnv = envSchema.safeParse(import.meta.env);

  if (!parsedEnv.success) {
    throw new Error("VITE_CHAT_API_URL is not configured.");
  }

  return getChatApiUrl(
    normalizeChatApiPath(
      parsedEnv.data.VITE_CHAT_ASK_STREAM_PATH ??
        defaultAskQuestionStreamPath
    )
  );
}

function normalizeChatApiPath(path: string): `/${string}` {
  const normalizedPath = path.trim().replace(/^\/+/, "");

  if (!normalizedPath) {
    return defaultAskQuestionStreamPath;
  }

  return `/${normalizedPath}`;
}
