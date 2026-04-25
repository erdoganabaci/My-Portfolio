import {useCallback, useEffect, useRef, useState} from "react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCode,
  FiCpu,
  FiHelpCircle,
  FiSend,
  FiShield,
  FiStar,
  FiUser,
  FiZap
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Modal} from "@/components/ui/modal";
import {askQuestion} from "@/features/chat/api/ask-question";
import {getAvailableModels} from "@/features/chat/api/get-available-models";
import {quickPrompts} from "@/features/chat/config/models";
import {
  assistantMessageCompleted,
  assistantMessageFailed,
  assistantTokenReceived,
  createChatMessage,
  messageSendFinished,
  messageSendStarted,
  modelsLoadFailed,
  modelsLoadStarted,
  modelsLoadSucceeded,
  selectedModelChanged,
  selectAvailableModels,
  selectChatMessages,
  selectConversationHistory,
  selectIsLoading,
  selectIsModelsLoading,
  selectModelsError,
  selectSelectedModel,
  selectStreamingMessageId
} from "@/features/chat/state/chat-slice";
import {useAppDispatch, useAppSelector} from "@/state/hooks";

const promptIconClassNames = [
  "text-cyan-600 dark:text-cyan-300",
  "text-emerald-600 dark:text-emerald-300",
  "text-amber-600 dark:text-amber-300",
  "text-violet-600 dark:text-violet-300",
  "text-rose-600 dark:text-rose-300"
];

function getPromptIcon(index: number) {
  const className = `size-4 shrink-0 ${
    promptIconClassNames[index % promptIconClassNames.length]
  }`;

  switch (index % 5) {
    case 0:
      return <FiBookOpen className={className} />;
    case 1:
      return <FiCode className={className} />;
    case 2:
      return <FiBriefcase className={className} />;
    case 3:
      return <FiStar className={className} />;
    default:
      return <FiZap className={className} />;
  }
}

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
  const dispatch = useAppDispatch();
  const messagesListRef = useRef<HTMLDivElement | null>(null);
  const promptListRef = useRef<HTMLDivElement | null>(null);
  const previousMessageCountRef = useRef(1);
  const shouldAutoScrollMessagesRef = useRef(true);
  const [canScrollPromptsLeft, setCanScrollPromptsLeft] = useState(false);
  const [canScrollPromptsRight, setCanScrollPromptsRight] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const availableModels = useAppSelector(selectAvailableModels);
  const conversationHistory = useAppSelector(selectConversationHistory);
  const isLoading = useAppSelector(selectIsLoading);
  const isModelsLoading = useAppSelector(selectIsModelsLoading);
  const messages = useAppSelector(selectChatMessages);
  const modelsError = useAppSelector(selectModelsError);
  const selectedModel = useAppSelector(selectSelectedModel);
  const streamingMessageId = useAppSelector(selectStreamingMessageId);

  const updatePromptScrollState = useCallback(() => {
    const promptList = promptListRef.current;

    if (!promptList) {
      return;
    }

    const maxScrollLeft = promptList.scrollWidth - promptList.clientWidth;

    setCanScrollPromptsLeft(promptList.scrollLeft > 4);
    setCanScrollPromptsRight(maxScrollLeft - promptList.scrollLeft > 4);
  }, []);

  const loadModels = useCallback(async () => {
    dispatch(modelsLoadStarted());

    try {
      const models = await getAvailableModels();

      dispatch(modelsLoadSucceeded(models));
    } catch (error) {
      dispatch(modelsLoadFailed(
        error instanceof Error
          ? error.message
          : "Failed to load available chat models."
      ));
    }
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadModels();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadModels]);

  useEffect(() => {
    updatePromptScrollState();

    const promptList = promptListRef.current;

    if (!promptList) {
      return;
    }

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updatePromptScrollState);

    resizeObserver?.observe(promptList);
    window.addEventListener("resize", updatePromptScrollState);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePromptScrollState);
    };
  }, [updatePromptScrollState]);

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

  const scrollPromptList = useCallback(
    (direction: "previous" | "next") => {
      const promptList = promptListRef.current;

      if (!promptList) {
        return;
      }

      const scrollAmount = Math.max(260, promptList.clientWidth * 0.72);
      const left = direction === "next" ? scrollAmount : -scrollAmount;

      promptList.scrollBy({behavior: "smooth", left});
      window.setTimeout(updatePromptScrollState, 250);
    },
    [updatePromptScrollState]
  );

  async function sendMessage(predefinedQuestion?: string) {
    const question = predefinedQuestion ?? inputText.trim();

    if (!question || isLoading || !selectedModel) {
      return;
    }

    const userMessage = createChatMessage({
      isUser: true,
      text: question
    });
    const assistantMessage = createChatMessage({
      isUser: false,
      text: ""
    });

    setInputText("");
    dispatch(messageSendStarted({
      assistantMessage,
      userMessage
    }));

    try {
      const result = await askQuestion({
        conversationHistory,
        model: selectedModel.id,
        onToken: token => {
          dispatch(assistantTokenReceived({
            messageId: assistantMessage.id,
            token
          }));
        },
        question,
        vectorData: (await import("@/features/chat/data/vector-data.json"))
          .default.vectorData
      });

      dispatch(assistantMessageCompleted({
        answer: result.answer,
        followUpSuggestions: result.followUpSuggestions,
        messageId: assistantMessage.id
      }));
    } catch (error) {
      dispatch(assistantMessageFailed({
        messageId: assistantMessage.id,
        text: error instanceof Error
          ? error.message
          : "Sorry, there was an error processing your request."
      }));
    } finally {
      dispatch(messageSendFinished());
    }
  }

  return (
    <div className="h-dvh overflow-hidden bg-[#f7fbfa] text-slate-950 dark:bg-[#06111d] dark:text-white">
      <div className="flex h-full flex-col overflow-hidden bg-[linear-gradient(135deg,rgba(14,165,233,0.12),transparent_34%,rgba(16,185,129,0.12)_72%,transparent)] dark:bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(2,6,23,0)_34%,rgba(16,185,129,0.11)_72%,rgba(2,6,23,0))]">
        <header className="z-10 shrink-0 border-b border-slate-200/70 bg-white/70 px-4 py-3 shadow-[0_16px_60px_-48px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.45] sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-6">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[0.9rem] border border-emerald-500/60 bg-emerald-500/10 text-sm font-black text-emerald-700 shadow-[0_0_28px_-14px_rgba(16,185,129,0.9)] dark:border-emerald-300/70 dark:bg-emerald-300/10 dark:text-emerald-200">
                  AI
                </span>
                <span className="hidden truncate text-xl font-semibold text-slate-950 dark:text-white sm:block">
                  CV Chat
                </span>
              </div>
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white sm:px-3 sm:text-base"
                onClick={() => void navigate("/")}
                type="button"
              >
                <FiArrowLeft className="size-4 shrink-0" />
                <span className="hidden sm:inline">Back to profiles</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 text-sm font-semibold text-slate-900 shadow-[0_16px_44px_-34px_rgba(15,23,42,0.6)] transition hover:-translate-y-0.5 hover:border-cyan-500/60 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-cyan-300/60 dark:hover:bg-white/10 sm:px-5"
                onClick={() => setIsModelModalOpen(true)}
                type="button"
              >
                <FiZap className="size-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
                <span className="max-w-[8.5rem] truncate sm:max-w-[13rem]">
                  {isModelsLoading
                    ? "Loading models"
                    : (selectedModel?.name ?? "Models unavailable")}
                </span>
                <FiChevronDown className="size-4 shrink-0 text-slate-500 dark:text-slate-400" />
              </button>
              <span className="hidden size-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 shadow-[0_16px_44px_-34px_rgba(15,23,42,0.6)] dark:border-white/10 dark:bg-white/5 sm:inline-flex">
                <span className="size-3 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.8)] dark:bg-emerald-300" />
              </span>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 px-3 py-4 sm:px-6 lg:px-8">
          <section className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/[0.55] shadow-[0_30px_100px_-70px_rgba(15,23,42,0.75)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/[0.35]">
            <div
              aria-label="Chat messages"
              className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8 lg:px-12"
              onScroll={handleMessagesScroll}
              ref={messagesListRef}
            >
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
                <div className="grid gap-4 pt-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-start lg:pt-7">
                  <div>
                    <h1 className="text-balance text-3xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                      Chat with Erdogan's profile
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                      Ask about experience, education, skills, projects, and
                      achievements.
                    </p>
                  </div>
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200">
                    <span className="size-2.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                    Profile context
                    <FiShield className="size-4" />
                  </div>
                </div>

                <div className="space-y-5 pb-5">
                  {messages.map(message => {
                    const text =
                      message.text ||
                      (message.id === streamingMessageId ? "Thinking..." : "");
                    const followUpSuggestions =
                      !message.isUser && message.status === "completed"
                        ? (message.followUpSuggestions ?? [])
                        : [];

                    return (
                      <div
                        className={`flex items-end gap-3 ${
                          message.isUser ? "justify-end" : "justify-start"
                        }`}
                        key={message.id}
                      >
                        {!message.isUser ? (
                          <span className="hidden size-11 shrink-0 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-700 shadow-[0_0_34px_-18px_rgba(6,182,212,0.95)] dark:border-cyan-300/35 dark:bg-cyan-300/10 dark:text-cyan-200 sm:inline-flex">
                            <FiCpu className="size-5" />
                          </span>
                        ) : null}

                        <div
                          className={`flex min-w-0 max-w-[calc(100%-1rem)] flex-col ${
                            message.isUser ? "items-end" : "items-start"
                          } sm:max-w-[78%]`}
                        >
                          <article
                            className={`w-full rounded-[1.4rem] border px-5 py-4 shadow-[0_18px_55px_-38px_rgba(15,23,42,0.85)] ${
                              message.isUser
                                ? "rounded-br-md border-cyan-500/60 bg-[linear-gradient(135deg,#047857,#0e7490)] text-white dark:border-cyan-300/40 dark:bg-[linear-gradient(135deg,rgba(20,184,166,0.6),rgba(6,182,212,0.42))]"
                                : "rounded-bl-md border-slate-200/80 bg-white/80 text-slate-800 dark:border-white/10 dark:bg-white/[0.07] dark:text-slate-100"
                            }`}
                          >
                            {message.isUser ? (
                              <p className="whitespace-pre-wrap text-sm leading-7">
                                {text}
                              </p>
                            ) : (
                              <AssistantMarkdown text={text} />
                            )}
                            <p
                              className={`mt-3 flex items-center gap-2 text-xs ${
                                message.isUser
                                  ? "justify-end text-cyan-50/75"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {message.timestamp}
                              {message.isUser ? (
                                <FiCheckCircle className="size-3.5 text-cyan-100/90" />
                              ) : null}
                            </p>
                          </article>

                          {followUpSuggestions.length > 0 ? (
                            <FollowUpSuggestions
                              disabled={isLoading || !selectedModel}
                              onSelect={suggestion =>
                                void sendMessage(suggestion)
                              }
                              suggestions={followUpSuggestions}
                            />
                          ) : null}
                        </div>

                        {message.isUser ? (
                          <span className="hidden size-11 shrink-0 items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-700 shadow-[0_0_34px_-18px_rgba(14,165,233,0.95)] dark:border-sky-300/35 dark:bg-sky-300/10 dark:text-sky-200 sm:inline-flex">
                            <FiUser className="size-5" />
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-200/70 bg-white/60 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/[0.45] sm:px-8 lg:px-12">
              <div className="mx-auto max-w-5xl">
                <div className="mb-3 flex items-center gap-2">
                  <button
                    aria-label="Show previous quick prompts"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-[0_14px_36px_-22px_rgba(15,23,42,0.8)] backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-slate-950 disabled:pointer-events-none disabled:opacity-35 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-white"
                    disabled={!canScrollPromptsLeft}
                    onClick={() => scrollPromptList("previous")}
                    type="button"
                  >
                    <FiChevronLeft className="size-5" />
                  </button>

                  <div
                    aria-label="Quick prompts"
                    className="flex min-w-0 flex-1 snap-x gap-3 overflow-x-auto scroll-smooth px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    onScroll={updatePromptScrollState}
                    ref={promptListRef}
                  >
                    {quickPrompts.map((prompt, index) => (
                      <button
                        className="inline-flex min-h-12 shrink-0 snap-start items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-left text-sm font-medium text-slate-700 shadow-[0_16px_44px_-38px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-slate-950 disabled:pointer-events-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:bg-white/10 dark:hover:text-white"
                        disabled={isLoading || !selectedModel}
                        key={prompt}
                        onClick={() => void sendMessage(prompt)}
                        type="button"
                      >
                        {getPromptIcon(index)}
                        <span className="max-w-[16rem] truncate">{prompt}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    aria-label="Show more quick prompts"
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/90 text-slate-700 shadow-[0_14px_36px_-22px_rgba(15,23,42,0.8)] backdrop-blur transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-slate-950 disabled:pointer-events-none disabled:opacity-35 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-white"
                    disabled={!canScrollPromptsRight}
                    onClick={() => scrollPromptList("next")}
                    type="button"
                  >
                    <FiChevronRight className="size-5" />
                  </button>
                </div>

                <div className="rounded-[1.45rem] border border-cyan-500/35 bg-white/[0.85] p-3 shadow-[0_24px_70px_-42px_rgba(8,145,178,0.7)] backdrop-blur-xl dark:border-cyan-300/25 dark:bg-[#0b1a2a]/[0.85]">
                  <textarea
                    className="min-h-20 w-full resize-none border-none bg-transparent px-3 py-3 text-base leading-7 text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 sm:min-h-24"
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
                    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {modelsError ??
                        "Profile context is active. Answers use Erdogan's static CV vector snapshot."}
                    </p>
                    <Button
                      className="min-w-32 rounded-[1rem] border-cyan-500 bg-cyan-500 px-5 py-3 text-base normal-case tracking-normal text-white shadow-[0_18px_46px_-26px_rgba(6,182,212,0.95)] hover:bg-cyan-400 dark:border-cyan-300 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                      disabled={isLoading || !selectedModel}
                      onClick={() => void sendMessage()}
                      variant="primary"
                    >
                      <FiSend className="size-5" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
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
                    dispatch(selectedModelChanged(model.id));
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

function FollowUpSuggestions({
  disabled,
  onSelect,
  suggestions
}: {
  disabled: boolean;
  onSelect: (suggestion: string) => void;
  suggestions: string[];
}) {
  return (
    <div className="mt-3 w-full space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <FiHelpCircle className="size-3.5" />
        <span>Follow-up suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(suggestion => (
          <button
            className="max-w-full rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-left text-xs font-medium leading-5 text-slate-700 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-slate-950 disabled:pointer-events-none disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:bg-white/10 dark:hover:text-white"
            disabled={disabled}
            key={suggestion}
            onClick={() => onSelect(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>
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
