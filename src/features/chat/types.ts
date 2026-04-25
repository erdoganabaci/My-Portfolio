export type ChatMessageStatus = "completed" | "failed" | "pending";

export type ChatMessage = {
  followUpSuggestions?: string[];
  id: string;
  isUser: boolean;
  status: ChatMessageStatus;
  text: string;
  timestamp: string;
};

export type ConversationHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AskQuestionResult = {
  answer: string;
  followUpSuggestions: string[];
};
