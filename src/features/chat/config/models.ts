export type ChatModel = {
  id: string;
  name: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "openai/gpt-3.5-turbo",
    name: "GPT-3.5"
  },
  {
    id: "openai/gpt-4o-2024-11-20",
    name: "GPT-4o"
  },
  {
    id: "deepseek/deepseek-r1-distill-llama-70b:free",
    name: "DeepSeek R1 70B"
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude Sonnet"
  },
  {
    id: "google/gemini-2.0-flash-lite-preview-02-05:free",
    name: "Gemini 2.0 Flash"
  },
  {
    id: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
    name: "Mistral Dolphin 24B"
  }
];

export const defaultChatModel = chatModels[0]!;

export const quickPrompts = [
  "Summarize Erdogan's education.",
  "What are Erdogan's strongest technical skills?",
  "Tell me about Erdogan's recent work experience.",
  "What projects has Erdogan worked on?",
  "Does Erdogan have AI experience?"
];
