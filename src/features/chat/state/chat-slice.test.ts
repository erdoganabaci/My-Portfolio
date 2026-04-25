import {describe, expect, it} from "vitest";
import {
  assistantMessageCompleted,
  assistantTokenReceived,
  createChatMessage,
  messageSendFinished,
  messageSendStarted,
  selectChatMessages,
  selectConversationHistory
} from "@/features/chat/state/chat-slice";
import {createAppStore, type AppStore} from "@/state/store";

function addCompletedTurn(store: AppStore, question: string, answer: string) {
  const userMessage = createChatMessage({
    isUser: true,
    text: question
  });
  const assistantMessage = createChatMessage({
    isUser: false,
    text: ""
  });

  store.dispatch(messageSendStarted({assistantMessage, userMessage}));
  store.dispatch(assistantMessageCompleted({
    answer,
    messageId: assistantMessage.id
  }));
  store.dispatch(messageSendFinished());
}

describe("chatSlice", () => {
  it("compresses older turns and keeps the last 10 completed turns for request context", () => {
    const store = createAppStore();

    for (let index = 1; index <= 12; index += 1) {
      addCompletedTurn(store, `Question ${index}`, `Answer ${index}`);
    }

    const history = selectConversationHistory(store.getState());

    expect(history).toHaveLength(21);
    expect(history[0]?.role).toBe("assistant");
    expect(history[0]?.content).toContain(
      "First user question in this session: Question 1"
    );
    expect(history[0]?.content).toContain("Turns 1-2:");
    expect(history[1]).toEqual({role: "user", content: "Question 3"});
    expect(history[2]).toEqual({role: "assistant", content: "Answer 3"});
    expect(history.at(-2)).toEqual({role: "user", content: "Question 12"});
    expect(history.at(-1)).toEqual({role: "assistant", content: "Answer 12"});
  });

  it("appends streaming tokens to the active assistant message", () => {
    const store = createAppStore();
    const userMessage = createChatMessage({
      isUser: true,
      text: "Tell me about the recent role."
    });
    const assistantMessage = createChatMessage({
      isUser: false,
      text: ""
    });

    store.dispatch(messageSendStarted({assistantMessage, userMessage}));
    store.dispatch(assistantTokenReceived({
      messageId: assistantMessage.id,
      token: "Senior "
    }));
    store.dispatch(assistantTokenReceived({
      messageId: assistantMessage.id,
      token: "Software Engineer"
    }));

    const messages = selectChatMessages(store.getState());

    expect(
      messages.find(message => message.id === assistantMessage.id)?.text
    ).toBe("Senior Software Engineer");
    expect(selectConversationHistory(store.getState())).toEqual([]);
  });
});
