import {useCallback, useEffect, useRef, useState} from "react";
import {FiArrowLeft, FiChevronRight, FiCpu, FiSend} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Modal} from "@/components/ui/modal";
import {quickPrompts, type ChatModel} from "@/features/chat/config/models";
import {askQuestion} from "@/features/chat/api/ask-question";
import {getAvailableModels} from "@/features/chat/api/get-available-models";

type ChatMessage = {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: string;
};

function createTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

let messageIdCounter = 0;

function createMessageId(prefix: string) {
  messageIdCounter += 1;
  return `${prefix}-${messageIdCounter}`;
}

const initialMessage: ChatMessage = {
  id: "welcome-message",
  isUser: false,
  text: "Hello! I'm your AI assistant. I can answer questions about Erdogan's CV. How can I help you?",
  timestamp: createTimestamp()
};

const autoScrollThreshold = 80;

function isNearScrollBottom(element: HTMLElement) {
  return (
    element.scrollHeight - element.scrollTop - element.clientHeight <=
    autoScrollThreshold
  );
}

function scrollMessagesToBottom(element: HTMLElement) {
  element.scrollTop = element.scrollHeight;
}

export function ChatRoute() {
  const navigate = useNavigate();
  const messagesListRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCountRef = useRef(1);
  const shouldAutoScrollMessagesRef = useRef(true);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<ChatModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  const selectedModel =
    availableModels.find(model => model.id === selectedModelId) ??
    availableModels[0] ??
    null;

  const loadModels = useCallback(async () => {
    setIsModelsLoading(true);
    setModelsError(null);

    try {
      const models = await getAvailableModels();

      setAvailableModels(models);
      setSelectedModelId(currentModelId =>
        currentModelId && models.some(model => model.id === currentModelId)
          ? currentModelId
          : (models[0]?.id ?? null)
      );
    } catch (error) {
      setAvailableModels([]);
      setSelectedModelId(null);
      setModelsError(
        error instanceof Error
          ? error.message
          : "Failed to load available chat models."
      );
    } finally {
      setIsModelsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadModels();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadModels]);

  useEffect(() => {
    const messagesList = messagesListRef.current;

    if (!messagesList) {
      return;
    }

    const hasNewMessages = messages.length > previousMessageCountRef.current;
    previousMessageCountRef.current = messages.length;

    if (hasNewMessages) {
      shouldAutoScrollMessagesRef.current = true;
    }

    if (shouldAutoScrollMessagesRef.current) {
      scrollMessagesToBottom(messagesList);
    }
  }, [messages]);

  const handleMessagesScroll = useCallback(() => {
    const messagesList = messagesListRef.current;

    if (!messagesList) {
      return;
    }

    shouldAutoScrollMessagesRef.current = isNearScrollBottom(messagesList);
  }, []);

  async function sendMessage(predefinedQuestion?: string) {
    const question = predefinedQuestion ?? inputText.trim();

    if (!question || isLoading || !selectedModel) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createMessageId("user"),
      isUser: true,
      text: question,
      timestamp: createTimestamp()
    };
    const assistantMessage: ChatMessage = {
      id: createMessageId("assistant"),
      isUser: false,
      text: "",
      timestamp: createTimestamp()
    };

    setInputText("");
    setIsLoading(true);
    setStreamingMessageId(assistantMessage.id);
    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      assistantMessage
    ]);

    try {
      const answer = await askQuestion({
        model: selectedModel.id,
        onToken: token => {
          setMessages(currentMessages =>
            currentMessages.map(message =>
              message.id === assistantMessage.id
                ? {...message, text: `${message.text}${token}`}
                : message
            )
          );
        },
        question,
        vectorData: (await import("@/features/chat/data/vector-data.json"))
          .default.vectorData
      });

      setMessages(currentMessages =>
        currentMessages.map(message =>
          message.id === assistantMessage.id
            ? {...message, text: answer || message.text}
            : message
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Sorry, there was an error processing your request.";

      setMessages(currentMessages =>
        currentMessages.map(message =>
          message.id === assistantMessage.id
            ? {...message, text: errorMessage}
            : message
        )
      );
    } finally {
      setStreamingMessageId(null);
      setIsLoading(false);
    }
  }

  return (
    <div className="h-dvh overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100dvh-3rem)] max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-[var(--surface)] shadow-[0_30px_90px_-50px_var(--shadow)] backdrop-blur-xl">
        <header className="shrink-0 border-b border-slate-200/80 px-5 py-4 dark:border-white/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => void navigate("/")} variant="ghost">
                <FiArrowLeft className="size-4" />
                Back
              </Button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-800 dark:text-emerald-300">
                  CV Chat
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                  Chat with Erdogan's profile
                </h1>
              </div>
            </div>
            <Button
              onClick={() => setIsModelModalOpen(true)}
              variant="secondary"
            >
              <FiCpu className="size-4" />
              {isModelsLoading
                ? "Loading models"
                : (selectedModel?.name ?? "Models unavailable")}
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <aside className="min-h-0 shrink-0 border-b border-slate-200/80 px-5 py-4 dark:border-white/10 lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:py-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-800 dark:text-slate-100">
              Quick prompts
            </h2>
            <div className="-mx-1 mt-4 flex gap-3 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0">
              {quickPrompts.map(prompt => (
                <button
                  className="min-w-64 rounded-[1.5rem] border border-slate-200/80 bg-white/70 px-4 py-4 text-left text-sm leading-6 text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-slate-950 disabled:pointer-events-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-white lg:min-w-0"
                  disabled={isLoading || !selectedModel}
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex min-h-0 flex-1 flex-col">
            <div
              aria-label="Chat messages"
              className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5"
              onScroll={handleMessagesScroll}
              ref={messagesListRef}
            >
              {messages.map(message => {
                const text =
                  message.text ||
                  (message.id === streamingMessageId ? "Thinking..." : "");

                return (
                  <article
                    className={`max-w-3xl rounded-[1.6rem] border px-5 py-4 shadow-[0_18px_45px_-32px_var(--shadow)] ${
                      message.isUser
                        ? "ml-auto border-emerald-900 bg-emerald-900 text-white dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
                        : "border-slate-200/80 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                    }`}
                    key={message.id}
                  >
                    {message.isUser ? (
                      <p className="whitespace-pre-wrap text-sm leading-7">
                        {text}
                      </p>
                    ) : (
                      <AssistantMarkdown text={text} />
                    )}
                    <p
                      className={`mt-3 text-xs uppercase tracking-[0.18em] ${
                        message.isUser
                          ? "text-white/70 dark:text-emerald-950/70"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="shrink-0 border-t border-slate-200/80 px-5 py-5 dark:border-white/10">
              <div className="rounded-[1.8rem] border border-slate-200/80 bg-white/70 p-3 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5">
                <textarea
                  className="min-h-28 w-full resize-none border-none bg-transparent px-3 py-3 text-base leading-7 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                  onChange={event => setInputText(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder="Ask about Erdogan's experience, education, skills, or projects..."
                  value={inputText}
                />
                <div className="flex flex-col gap-3 border-t border-slate-200/80 px-2 pt-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {modelsError ??
                      "Powered by the selected model and a static CV vector snapshot."}
                  </p>
                  <Button
                    disabled={isLoading || !selectedModel}
                    onClick={() => void sendMessage()}
                    variant="primary"
                  >
                    <FiSend className="size-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModelModalOpen ? (
        <Modal
          description="Pick a model returned by the remote CV chat service."
          onClose={() => setIsModelModalOpen(false)}
          title="Select a chat model"
        >
          {isModelsLoading ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Loading models...
            </p>
          ) : null}

          {modelsError ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {modelsError}
              </p>
              <Button onClick={() => void loadModels()} variant="secondary">
                Retry
              </Button>
            </div>
          ) : null}

          {!isModelsLoading && !modelsError ? (
            <div className="grid gap-3">
              {availableModels.map(model => (
                <button
                  className={`flex items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition ${
                    model.id === selectedModel?.id
                      ? "border-emerald-800 bg-emerald-900 text-white dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
                      : "border-slate-200/80 bg-white/70 text-slate-800 hover:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:border-emerald-300"
                  }`}
                  key={model.id}
                  onClick={() => {
                    setSelectedModelId(model.id);
                    setIsModelModalOpen(false);
                  }}
                  type="button"
                >
                  <span className="font-medium">{model.name}</span>
                  <FiChevronRight className="size-4" />
                </button>
              ))}
            </div>
          ) : null}
        </Modal>
      ) : null}
    </div>
  );
}

function AssistantMarkdown({text}: {text: string}) {
  return (
    <ReactMarkdown
      components={{
        a: ({children, href}) => (
          <a
            className="font-medium text-emerald-800 underline underline-offset-4 hover:text-emerald-700 dark:text-emerald-300 dark:hover:text-emerald-200"
            href={href}
            rel="noreferrer"
            target="_blank"
          >
            {children}
          </a>
        ),
        li: ({children}) => <li className="pl-1">{children}</li>,
        ol: ({children}) => (
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm leading-7 last:mb-0">
            {children}
          </ol>
        ),
        p: ({children}) => (
          <p className="mb-3 whitespace-pre-wrap text-sm leading-7 last:mb-0">
            {children}
          </p>
        ),
        strong: ({children}) => (
          <strong className="font-semibold text-slate-950 dark:text-white">
            {children}
          </strong>
        ),
        ul: ({children}) => (
          <ul className="mb-3 list-disc space-y-1 pl-5 text-sm leading-7 last:mb-0">
            {children}
          </ul>
        )
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
