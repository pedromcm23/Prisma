import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (v: string) => void;
  editable: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
};

export function Editable({
  value,
  onChange,
  editable,
  as: Tag = "p",
  className,
  multiline = false,
  placeholder,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  // Keep DOM text in sync only when not focused (avoid caret jumps while editing).
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      contentEditable={editable}
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent || "";
        onChange(text);
      }}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={cn(
        editable && "editable hover:outline-terracotta/60 focus:editable-active",
        className,
      )}
    >
      {value}
    </Tag>
  );
}
