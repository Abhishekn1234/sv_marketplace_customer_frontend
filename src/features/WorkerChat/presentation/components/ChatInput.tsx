"use client";

import { useRef } from "react";

import { Textarea } from "@/components/input";

import Button from "@/components/input/Button";
import { SendIcon } from "@/components/icons";
import { useLanguage } from "@/features/context/LanguageContext";

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
};

export default function ChatInput({ value, onChange, onSend }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  const handleSend = () => {
    if (!value.trim()) return;

    onSend();
    textareaRef.current?.focus();
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const active = value.trim().length > 0;

  return (
    <div className="border-t border-gray-200 bg-white/95 px-3 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.05)] backdrop-blur sm:px-4">
      <div className="mx-auto max-w-4xl">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.jobtrackingpage.message}
          autoResize
          maxHeight={144}
          containerClassName="!mb-0"
          inputWrapperClassName="p-0"
          rightElementClassName="bottom-1.5 right-1.5"
          className="!min-h-[52px] max-h-36 resize-none rounded-2xl border-gray-200 bg-gray-50 py-3.5 pl-4 pr-14 text-[15px] leading-5 shadow-inner focus:bg-white"
          rightElement={
            <Button
              onClick={handleSend}
              size="sm"
              radius="full"
              icon
              disabled={!active}
              className={
                active
                  ? "h-10 w-10 border border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                  : "h-10 w-10 border border-gray-200 bg-gray-200 text-gray-400"
              }
              aria-label="Send message"
            >
              <SendIcon size={18} />
            </Button>
          }
        />
      </div>
    </div>
  );
}
