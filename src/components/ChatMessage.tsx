import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { ResponseStatus, type ResponseStep } from "./ResponseStatus";
import { SourceChip } from "./SourceChip";
import { Tooltip } from "./Tooltip";
import { useThread } from "./Thread";

export interface MessageSource {
  label: string;
  onPress?: () => void;
  href?: string;
}

export interface ChatMessageProps {
  /** Whose turn it is. A person's turn is a block on the right; the agent's reads like a page. */
  from: "user" | "assistant";
  /** The agent's name, shown in its turn and read before it: "garu". */
  name?: string;
  /** The mono line beside the name when the reply is done: "AI", "AI · reads your sources". */
  status?: string;
  /**
   * The words. A string, or an array of strings and <Cite n={1} />, becomes one paragraph (with the streaming caret).
   * Anything else (several paragraphs, a <Generated> block) is placed as it is.
   */
  children?: ReactNode;
  /** "streaming" shows the current step (or "Thinking"), the pulsing marks and a caret; "error" shows `error`. */
  state?: "done" | "streaming" | "error";
  /** What the agent did, shown as a trace under the name. While streaming, the running step names the status. */
  steps?: ResponseStep[];
  /** Numbered sources, matching <Cite n> marks in the text. Show them on any answer that states a fact. */
  sources?: MessageSource[];
  /** What went wrong, in plain words: "garu lost the thread halfway. nothing was saved." */
  error?: ReactNode;
  /** Try again: on a failed reply, and in the actions under a finished one. */
  onRetry?: () => void;
  onCopy?: () => void;
  /** Thumbs on a finished reply. Pass the current choice so the pressed one shows. */
  feedback?: "good" | "bad" | null;
  onFeedback?: (value: "good" | "bad") => void;
  /** On a person's turn: edit and send again. */
  onEdit?: () => void;
}

const isInline = (c: ReactNode) => typeof c === "string" || (Array.isArray(c) && c.every((x) => typeof x === "string" || typeof x === "number" || (x && typeof x === "object" && "type" in (x as object))));

/** One turn in a conversation with an AI. Put it in a <Thread>. */
export function ChatMessage({
  from, name = "Assistant", status, children, state = "done", steps, sources, error, onRetry, onCopy, feedback, onFeedback, onEdit,
}: ChatMessageProps) {
  const thread = useThread();
  const body = useRef<HTMLDivElement>(null);
  const was = useRef(state);

  // Announce a reply once, when it finishes (or fails), never word by word.
  useEffect(() => {
    if (was.current === "streaming" && state !== "streaming") {
      const text = body.current?.textContent?.trim();
      if (text) thread?.announce(`${name}: ${text}`);
    }
    was.current = state;
  }, [state, name, thread]);

  if (from === "user") {
    return (
      <article className="nk-msg nk-msg--user" aria-label="You said">
        <div className="nk-msg__bubble">{children}</div>
        {onEdit && (
          <div className="nk-msg__actions nk-msg__actions--user">
            <Tooltip content="Edit and send again">
              <IconButton label="Edit message" icon="pencil" variant="ghost" onPress={onEdit} />
            </Tooltip>
          </div>
        )}
      </article>
    );
  }

  const streaming = state === "streaming";
  const running = steps?.find((s) => s.status === "running");
  const meta = streaming ? (running?.label ?? "Thinking") : (status ?? "AI");
  const caret = streaming ? <span className="nk-msg__caret" aria-hidden="true" /> : null;
  const content =
    children == null ? null : isInline(children) ? (
      <p className="nk-msg__text">
        {children}
        {caret}
      </p>
    ) : (
      <>
        {children}
        {caret}
      </>
    );
  const done = state === "done";

  return (
    <article className="nk-msg" aria-label={`${name} said`}>
      <span className="nk-avatar nk-avatar--agent" role="img" aria-label={name}>
        <Icon name="sparkles" />
      </span>
      <div className="nk-msg__main" ref={body}>
        <div className="nk-msg__meta">
          <span className="nk-msg__name">{name}</span>
          <span className="nk-msg__status">{meta}</span>
          {streaming && (
            <span className="nk-thinking" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </div>
        {steps && steps.length > 0 && <ResponseStatus steps={steps} />}
        {state === "error" ? (
          <div className="nk-msg__error">
            <Icon name="circle-alert" />
            <span>
              {error}
              {onRetry && (
                <>
                  {" "}
                  <AriaButton className="nk-link" onPress={onRetry}>
                    Try again
                  </AriaButton>
                </>
              )}
            </span>
          </div>
        ) : (
          content
        )}
        {done && sources && sources.length > 0 && (
          <div className="nk-msg__sources">
            {sources.map((s, i) => (
              <SourceChip key={i} n={i + 1} label={s.label} onPress={s.onPress} href={s.href} />
            ))}
          </div>
        )}
        {done && (onCopy || onFeedback || onRetry) && (
          <div className="nk-msg__actions">
            {onCopy && (
              <Tooltip content="Copy">
                <IconButton label="Copy" icon="copy" variant="secondary" onPress={onCopy} />
              </Tooltip>
            )}
            {onFeedback && (
              <>
                <Tooltip content="Good answer">
                  <IconButton label="Good answer" icon="thumbs-up" variant="ghost" aria-pressed={feedback === "good"} onPress={() => onFeedback("good")} />
                </Tooltip>
                <Tooltip content="Bad answer">
                  <IconButton label="Bad answer" icon="thumbs-down" variant="ghost" aria-pressed={feedback === "bad"} onPress={() => onFeedback("bad")} />
                </Tooltip>
              </>
            )}
            {onRetry && (
              <Tooltip content="Try again">
                <IconButton label="Try again" icon="refresh-cw" variant="ghost" onPress={onRetry} />
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export interface GeneratedProps {
  /** What it is, in a few words: "Draft reply to the landlord". */
  title: string;
  children: ReactNode;
  onCopy?: () => void;
}

/** Content the agent made for the person to use (a draft, a summary to send), set apart from the conversation in the reading face. */
export function Generated({ title, children, onCopy }: GeneratedProps) {
  const id = useId();
  return (
    <figure className="nk-generated" aria-labelledby={id}>
      <figcaption className="nk-generated__head">
        <span id={id}>{title}</span>
        {onCopy && <IconButton label={`Copy ${title}`} icon="copy" size="sm" variant="ghost" onPress={onCopy} />}
      </figcaption>
      <div className={cx("nk-generated__body")}>{children}</div>
    </figure>
  );
}
