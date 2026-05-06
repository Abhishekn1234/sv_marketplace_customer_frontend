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
  const {t}=useLanguage();
  const handleSend = () => {
    if (!value.trim()) return;

    onSend();

    // optional UX improvement
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
    <div className="px-3 py-2">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.jobtrackingpage.message}
        autoResize
        containerClassName="!mb-0"
        rightElement={
          <Button
            onClick={handleSend}
            size="md"
            radius="lg"
            disabled={!active}
            className={`${
                active
                    ? "text-white border border-blue-500 bg-blue-600 hover:bg-blue-700 rounded-xl"
                    : "text-white border border-blue-500 bg-blue-600 hover:bg-blue-700 rounded-xl"
                }`}
          >
             <SendIcon size={20}/>
          </Button>
        }
      />
    </div>
  );
}