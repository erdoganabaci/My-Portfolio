import {useState} from "react";
import {FiArrowLeft, FiChevronRight, FiCpu, FiSend} from "react-icons/fi";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {Modal} from "@/components/ui/modal";
import {defaultChatModel, chatModels, quickPrompts} from "@/features/chat/config/models";
import {askQuestion} from "@/features/chat/api/ask-question";

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

const initialMessage: ChatMessage = {
  id: "welcome-message",
  isUser: false,
  text: "Hello! I'm your AI assistant. I can answer questions about Erdogan's CV. How can I help you?",
  timestamp: createTimestamp()
};

export function ChatRoute() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [selectedModelId, setSelectedModelId] = useState(defaultChatModel.id);

  const selectedModel =
    chatModels.find(model => model.id === selectedModelId) ?? defaultChatModel;

  async function sendMessage(predefinedQuestion?: string) {
    const question = predefinedQuestion ?? inputText.trim();

    if (!question || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      isUser: true,
      text: question,
      timestamp: createTimestamp()
    };

    setInputText("");
    setIsLoading(true);
    setMessages(currentMessages => [...currentMessages, userMessage]);

    try {
      const answer = await askQuestion({
        model: selectedModel.id,
        question,
        vectorData: (
          await import("@/features/chat/data/vector-data.json")
        ).default.vectorData
      });

      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: `assistant-${Date.now()}`,
          isUser: false,
          text: answer,
          timestamp: createTimestamp()
        }
      ]);
    } catch (error) {
      setMessages(currentMessages => [
        ...currentMessages,
        {
          id: `assistant-error-${Date.now()}`,
          isUser: false,
          text:
            error instanceof Error
              ? error.message
              : "Sorry, there was an error processing your request.",
          timestamp: createTimestamp()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/40 bg-[var(--surface)] shadow-[0_30px_90px_-50px_var(--shadow)] backdrop-blur-xl">
        <header className="border-b border-slate-200/80 px-5 py-4 dark:border-white/10">
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
            <Button onClick={() => setIsModelModalOpen(true)} variant="secondary">
              <FiCpu className="size-4" />
              {selectedModel.name}
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <aside className="border-b border-slate-200/80 px-5 py-5 dark:border-white/10 lg:w-80 lg:border-b-0 lg:border-r">
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-800 dark:text-slate-100">
              Quick prompts
            </h2>
            <div className="mt-4 grid gap-3">
              {quickPrompts.map(prompt => (
                <button
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white/70 px-4 py-4 text-left text-sm leading-6 text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-emerald-300 dark:hover:text-white"
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              {messages.map(message => (
                <article
                  className={`max-w-3xl rounded-[1.6rem] border px-5 py-4 shadow-[0_18px_45px_-32px_var(--shadow)] ${
                    message.isUser
                      ? "ml-auto border-emerald-900 bg-emerald-900 text-white dark:border-emerald-300 dark:bg-emerald-300 dark:text-emerald-950"
                      : "border-slate-200/80 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                  }`}
                  key={message.id}
                >
                  <p className="whitespace-pre-wrap text-sm leading-7">{message.text}</p>
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
              ))}
              {isLoading ? (
                <div className="max-w-sm rounded-[1.6rem] border border-slate-200/80 bg-white/70 px-5 py-4 text-sm text-slate-600 shadow-[0_18px_45px_-32px_var(--shadow)] dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Thinking...
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-200/80 px-5 py-5 dark:border-white/10">
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
                    Powered by the selected model and a static CV vector snapshot.
                  </p>
                  <Button onClick={() => void sendMessage()} variant="primary">
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
          description="Pick the model identifier that should be sent to the remote CV chat service."
          onClose={() => setIsModelModalOpen(false)}
          title="Select a chat model"
        >
          <div className="grid gap-3">
            {chatModels.map(model => (
              <button
                className={`flex items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition ${
                  model.id === selectedModel.id
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
        </Modal>
      ) : null}
    </div>
  );
}
