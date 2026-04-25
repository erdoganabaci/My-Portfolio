import {z} from "zod";

const envSchema = z.object({
  VITE_CHAT_API_URL: z.string().url()
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
