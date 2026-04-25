import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {ChatModel} from "@/features/chat/config/models";
import type {
  ChatMessage,
  ChatMessageStatus,
  ConversationHistoryMessage
} from "@/features/chat/types";

const conversationHistoryTurnLimit = 10;

type ChatState = {
  availableModels: ChatModel[];
  isLoading: boolean;
  isModelsLoading: boolean;
  messages: ChatMessage[];
  modelsError: string | null;
  selectedModelId: string | null;
  streamingMessageId: string | null;
};

let messageIdCounter = 0;

function createTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function createChatMessage({
  isUser,
  status,
  text
}: Pick<ChatMessage, "isUser" | "text"> & {
  status?: ChatMessageStatus;
}): ChatMessage {
  messageIdCounter += 1;

  return {
    id: `${isUser ? "user" : "assistant"}-${messageIdCounter}`,
    isUser,
    status: status ?? getInitialMessageStatus({isUser, text}),
    text,
    timestamp: createTimestamp()
  };
}

const initialMessage: ChatMessage = {
  id: "welcome-message",
  isUser: false,
  status: "completed",
  text: "Hello! I'm your AI assistant. I can answer questions about Erdogan's CV and help you quickly understand his experience, skills, and achievements.",
  timestamp: createTimestamp()
};

const initialState: ChatState = {
  availableModels: [],
  isLoading: false,
  isModelsLoading: true,
  messages: [initialMessage],
  modelsError: null,
  selectedModelId: null,
  streamingMessageId: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    assistantMessageCompleted(
      state,
      action: PayloadAction<{answer: string; messageId: string}>
    ) {
      updateMessageText(state, action.payload.messageId, (currentText) =>
        action.payload.answer || currentText
      );
      updateMessageStatus(state, action.payload.messageId, "completed");
    },
    assistantMessageFailed(
      state,
      action: PayloadAction<{messageId: string; text: string}>
    ) {
      updateMessageText(state, action.payload.messageId, () => action.payload.text);
      updateMessageStatus(state, action.payload.messageId, "failed");
    },
    assistantTokenReceived(
      state,
      action: PayloadAction<{messageId: string; token: string}>
    ) {
      updateMessageText(
        state,
        action.payload.messageId,
        (currentText) => `${currentText}${action.payload.token}`
      );
    },
    messageSendFinished(state) {
      state.isLoading = false;
      state.streamingMessageId = null;
    },
    messageSendStarted(
      state,
      action: PayloadAction<{
        assistantMessage: ChatMessage;
        userMessage: ChatMessage;
      }>
    ) {
      state.isLoading = true;
      state.streamingMessageId = action.payload.assistantMessage.id;
      state.messages.push(action.payload.userMessage, action.payload.assistantMessage);
    },
    modelsLoadFailed(state, action: PayloadAction<string>) {
      state.availableModels = [];
      state.isModelsLoading = false;
      state.modelsError = action.payload;
      state.selectedModelId = null;
    },
    modelsLoadStarted(state) {
      state.isModelsLoading = true;
      state.modelsError = null;
    },
    modelsLoadSucceeded(state, action: PayloadAction<ChatModel[]>) {
      state.availableModels = action.payload;
      state.isModelsLoading = false;
      state.modelsError = null;
      state.selectedModelId = getSelectedModelId(
        state.selectedModelId,
        action.payload
      );
    },
    selectedModelChanged(state, action: PayloadAction<string>) {
      state.selectedModelId = action.payload;
    }
  }
});

type ChatRootState = {
  chat: ChatState;
};

export const {
  assistantMessageCompleted,
  assistantMessageFailed,
  assistantTokenReceived,
  messageSendFinished,
  messageSendStarted,
  modelsLoadFailed,
  modelsLoadStarted,
  modelsLoadSucceeded,
  selectedModelChanged
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;

export function selectAvailableModels(state: ChatRootState) {
  return state.chat.availableModels;
}

export function selectChatMessages(state: ChatRootState) {
  return state.chat.messages;
}

export const selectConversationHistory = createSelector(
  [selectChatMessages, selectStreamingMessageId],
  (messages, streamingMessageId): ConversationHistoryMessage[] =>
    getCompletedTurns(messages, streamingMessageId)
    .slice(-conversationHistoryTurnLimit)
    .flatMap(({assistantMessage, userMessage}) => [
      {
        role: "user" as const,
        content: userMessage.text
      },
      {
        role: "assistant" as const,
        content: assistantMessage.text
      }
    ])
);

export function selectIsLoading(state: ChatRootState) {
  return state.chat.isLoading;
}

export function selectIsModelsLoading(state: ChatRootState) {
  return state.chat.isModelsLoading;
}

export function selectModelsError(state: ChatRootState) {
  return state.chat.modelsError;
}

export function selectSelectedModel(state: ChatRootState) {
  return (
    state.chat.availableModels.find(
      (model) => model.id === state.chat.selectedModelId
    ) ??
    state.chat.availableModels[0] ??
    null
  );
}

export function selectStreamingMessageId(state: ChatRootState) {
  return state.chat.streamingMessageId;
}

function getCompletedTurns(
  messages: ChatMessage[],
  streamingMessageId: string | null
) {
  const turns: Array<{assistantMessage: ChatMessage; userMessage: ChatMessage}> = [];

  messages.forEach((message, index) => {
    const assistantMessage = messages[index + 1];

    if (
      !message.isUser ||
      !assistantMessage ||
      assistantMessage.isUser ||
      assistantMessage.id === streamingMessageId ||
      message.status !== "completed" ||
      assistantMessage.status !== "completed" ||
      !message.text.trim() ||
      !assistantMessage.text.trim()
    ) {
      return;
    }

    turns.push({
      assistantMessage,
      userMessage: message
    });
  });

  return turns;
}

function getSelectedModelId(
  currentModelId: string | null,
  models: ChatModel[]
) {
  if (currentModelId && models.some((model) => model.id === currentModelId)) {
    return currentModelId;
  }

  return models[0]?.id ?? null;
}

function updateMessageText(
  state: ChatState,
  messageId: string,
  getText: (currentText: string) => string
) {
  const message = state.messages.find((item) => item.id === messageId);

  if (message) {
    message.text = getText(message.text);
  }
}

function updateMessageStatus(
  state: ChatState,
  messageId: string,
  status: ChatMessageStatus
) {
  const message = state.messages.find((item) => item.id === messageId);

  if (message) {
    message.status = status;
  }
}

function getInitialMessageStatus({
  isUser,
  text
}: Pick<ChatMessage, "isUser" | "text">): ChatMessageStatus {
  if (isUser || text.trim()) {
    return "completed";
  }

  return "pending";
}
