import {z} from "zod";
import type {ChatModel} from "@/features/chat/config/models";
import {getChatApiUrl} from "@/features/chat/api/chat-api-url";

const stringModelSchema = z
  .string()
  .trim()
  .min(1)
  .transform(id => ({
    id,
    name: id
  }));

const objectModelSchema = z
  .object({
    id: z.string().trim().min(1),
    label: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1).optional()
  })
  .passthrough()
  .transform(model => ({
    id: model.id,
    name: model.name ?? model.label ?? model.id
  }));

const modelSchema = z.union([stringModelSchema, objectModelSchema]);

const modelsResponseSchema = z
  .union([
    z.array(modelSchema),
    z
      .object({models: z.array(modelSchema)})
      .transform(response => response.models),
    z.object({data: z.array(modelSchema)}).transform(response => response.data)
  ])
  .refine(models => models.length > 0, {
    message: "Chat API returned no available models."
  });

export async function getAvailableModels(): Promise<ChatModel[]> {
  const response = await fetch(getChatApiUrl("/getAvailableModels"));

  if (!response.ok) {
    throw new Error("Failed to load available chat models.");
  }

  const parsedResponse = modelsResponseSchema.safeParse(await response.json());

  if (!parsedResponse.success) {
    throw new Error("Chat API returned an invalid models payload.");
  }

  return parsedResponse.data;
}
