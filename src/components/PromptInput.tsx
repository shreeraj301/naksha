import { forwardRef, useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Button as AriaButton, DropZone, FileTrigger } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

export interface PromptAttachment {
  id: string;
  /** File name, shown on the chip and in the remove button's label. */
  name: string;
  /** A short fact after the name, in mono: "4 pages", "2.1 MB". */
  meta?: string;
}

export interface PromptInputProps {
  /** Accessible name of the text box, for example "Message garu". */
  label: string;
  placeholder?: string;
  /** Controlled text. Leave out and use `defaultValue` for uncontrolled. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Enter, or the send button. Not called while empty, while generating, or while an input method is composing. */
  onSubmit?: (value: string) => void;
  /** A reply is streaming: send becomes stop. */
  isGenerating?: boolean;
  /** Stop the reply. Always reachable while generating, so a person can interrupt. */
  onStop?: () => void;
  /** Files already attached, shown as chips above the text. */
  attachments?: PromptAttachment[];
  onRemoveAttachment?: (id: string) => void;
  /** Turns on the attach button and dropping files on the box. */
  onAddFiles?: (files: File[]) => void;
  /** Accepted MIME types for attach and drop, for example ["application/pdf", "image/*"]. */
  acceptedFileTypes?: string[];
  /** Turns on the dictate button. */
  onDictate?: () => void;
  /** A control beside send, usually <PromptLevel>, so people steer before they ask. */
  level?: ReactNode;
  /** The trust line under the box: "garu can be wrong. Check the sources." */
  note?: ReactNode;
  /** The keyboard hint under the box (Enter sends, Shift Enter adds a line). On by default. */
  showKeyHint?: boolean;
  isDisabled?: boolean;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only: draw the focused box at rest. */
  forceState?: "focus";
}

/** The composer for talking to an AI: text that grows from two lines to eight, attach, dictate, a steering control, and send that becomes stop. */
export const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(function PromptInput(
  {
    label, placeholder, value, defaultValue = "", onChange, onSubmit, isGenerating, onStop, attachments = [], onRemoveAttachment,
    onAddFiles, acceptedFileTypes, onDictate, level, note, showKeyHint = true, isDisabled, styles, forceState,
  },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const text = value ?? inner;
  const area = useRef<HTMLTextAreaElement | null>(null);
  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      area.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  // Grow with the text, up to the CSS max-height (eight lines), then scroll. Only touch height when the text overflows,
  // so a short prompt keeps the CSS two-line height exactly.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "";
    if (el.scrollHeight > el.clientHeight) el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
  }, [text]);

  const canSend = text.trim().length > 0 && !isGenerating && !isDisabled;
  const submit = () => {
    if (canSend) onSubmit?.(text);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // keyCode 229 covers browsers that do not set isComposing on the final keydown of an IME word.
    if (e.key !== "Enter" || e.shiftKey || e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    submit();
  };
  const change = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const box = (
    <div className={cx("nk-prompt__box", forceState === "focus" && "is-focus")}>
      {attachments.length > 0 && (
        <div className="nk-prompt__attach">
          {attachments.map((a) => (
            <span className="nk-file" key={a.id}>
              <Icon name="file-text" />
              {a.name} {a.meta && <small>{a.meta}</small>}
              {onRemoveAttachment && (
                <IconButton label={`Remove ${a.name}`} icon="x" size="sm" variant="ghost" slotClassName="nk-file__remove" onPress={() => onRemoveAttachment(a.id)} />
              )}
            </span>
          ))}
        </div>
      )}
      <textarea
        ref={setRefs}
        className="nk-prompt__text"
        rows={2}
        aria-label={label}
        placeholder={placeholder}
        value={text}
        disabled={isDisabled}
        onChange={(e) => change(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="nk-prompt__bar">
        {onAddFiles && (
          <FileTrigger acceptedFileTypes={acceptedFileTypes} allowsMultiple onSelect={(list) => list && onAddFiles(Array.from(list))}>
            <IconButton label="Attach a file" icon="paperclip" size="sm" variant="ghost" isDisabled={isDisabled} />
          </FileTrigger>
        )}
        {onDictate && <IconButton label="Dictate" icon="mic" size="sm" variant="ghost" isDisabled={isDisabled} onPress={onDictate} />}
        <span className="nk-grow" />
        {level}
        {isGenerating ? (
          <IconButton label="Stop generating" icon="square" variant="primary" slotClassName="nk-prompt__send" onPress={onStop} />
        ) : (
          <IconButton label="Send" icon="arrow-up" variant="primary" slotClassName="nk-prompt__send" isDisabled={!canSend} onPress={submit} />
        )}
      </div>
    </div>
  );

  return (
    <div className="nk-prompt" style={layoutStyle(styles)}>
      {onAddFiles ? (
        <DropZone
          className="nk-prompt__drop"
          isDisabled={isDisabled}
          getDropOperation={(types) => (acceptedFileTypes?.length && ![...acceptedFileTypes].some((t) => types.has(t)) ? "cancel" : "copy")}
          onDrop={async (e) => {
            const files = await Promise.all(e.items.filter((i) => i.kind === "file").map((i) => (i as { getFile: () => Promise<File> }).getFile()));
            if (files.length) onAddFiles(files);
          }}
        >
          {box}
        </DropZone>
      ) : (
        box
      )}
      {(note || showKeyHint) && (
        <div className="nk-prompt__note">
          <span>{note}</span>
          {showKeyHint && (
            <span>
              <span className="nk-kbd">↵</span> send · <span className="nk-kbd">⇧</span> <span className="nk-kbd">↵</span> new line
            </span>
          )}
        </div>
      )}
    </div>
  );
});

export interface PromptLevelProps {
  children: ReactNode;
  onPress?: () => void;
  /** Preview only. */
  forceState?: "hover";
}

/** The quiet steering trigger beside send ("Everyday ⌄"). In step 3 it opens a menu. */
export function PromptLevel({ children, onPress, forceState }: PromptLevelProps) {
  return (
    <AriaButton className={cx("nk-prompt__level", forceState === "hover" && "is-hover")} aria-haspopup="menu" onPress={onPress}>
      {children} <Icon name="chevron-down" />
    </AriaButton>
  );
}
