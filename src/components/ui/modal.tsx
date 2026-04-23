import type {PropsWithChildren} from "react";
import {Button} from "@/components/ui/button";

type ModalProps = PropsWithChildren<{
  description?: string;
  onClose: () => void;
  title: string;
}>;

export function Modal({children, description, onClose, title}: ModalProps) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[var(--surface)] p-6 shadow-2xl shadow-slate-950/25 backdrop-blur-xl dark:border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                {description}
              </p>
            ) : null}
          </div>
          <Button aria-label="Close modal" onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
