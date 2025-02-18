export const DEFAULT_MODEL = "openai/gpt-3.5-turbo";

export const MODEL_PROVIDERS = {
  OPENAI: "openai",
  OPENROUTER: "openrouter"
};

export const AVAILABLE_MODELS = {
  [MODEL_PROVIDERS.OPENROUTER]: [
    {
      id: "openai/gpt-3.5-turbo",
      name: "GPT-3.5",
      provider: MODEL_PROVIDERS.OPENROUTER
    },
    {
      id: "openai/gpt-4o-2024-11-20",
      name: "GPT-4 Turbo",
      provider: MODEL_PROVIDERS.OPENROUTER
    },
    {
      id: "deepseek/deepseek-r1-distill-llama-70b:free",
      name: "Deepseek R1 70B",
      provider: MODEL_PROVIDERS.OPENROUTER
    },
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude Sonnet",
      provider: MODEL_PROVIDERS.OPENROUTER
    },
    {
      id: "google/gemini-2.0-flash-lite-preview-02-05:free",
      name: "Gemini 2.0 Flash",
      provider: MODEL_PROVIDERS.OPENROUTER
    },
    // {
    //   id: 'meta-llama/llama-2-70b-chat',
    //   name: 'Llama 2 70B',
    //   provider: MODEL_PROVIDERS.OPENROUTER
    // },
    {
      id: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
      name: "Mistral Dolphin 24B",
      provider: MODEL_PROVIDERS.OPENROUTER
    }
  ]
};

export const OPENROUTER_API_URL =
  "https://openrouter.ai/api/v1/chat/completions";
