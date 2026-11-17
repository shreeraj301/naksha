import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { TextArea, TextField } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { Count, FieldHelp, FieldLabel, fieldClass, type FieldProps } from "./Field";

export interface TextareaProps extends FieldProps {
  name?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Stops typing at this many characters and shows "0 / 6,000" on the right of the help line. */
  maxLength?: number;
  /** Lines shown when empty. It grows with the text to sixteen lines, then scrolls. */
  rows?: number;
  autoFocus?: boolean;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: "focus";
}

/** Several lines of text that grow as people write, with a label, help, error and an optional character count. For talking to an AI, use PromptInput. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, description, errorMessage, isInvalid, isDisabled, isRequired, isOptional, placeholder, value, defaultValue = "", onChange, maxLength, rows = 4, styles, forceState, ...field },
  ref,
) {
  const [inner, setInner] = useState(defaultValue);
  const text = value ?? inner;
  const length = text.length;
  const area = useRef<HTMLTextAreaElement | null>(null);
  const setRefs = useCallback(
    (el: HTMLTextAreaElement | null) => {
      area.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );
  // Grow with the text up to the CSS max-height, then scroll. Height is only set when the text overflows,
  // so a short entry keeps the CSS minimum exactly.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = "";
    if (el.scrollHeight > el.clientHeight) el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
  }, [text]);
  const countId = useId();
  const announce = useLimitAnnouncement(length, maxLength);
  return (
    <TextField
      {...field}
      className={fieldClass(isInvalid, isDisabled)}
      style={layoutStyle(styles)}
      value={value}
      defaultValue={value === undefined ? defaultValue : undefined}
      onChange={(next) => {
        if (value === undefined) setInner(next);
        onChange?.(next);
      }}
      maxLength={maxLength}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationBehavior="aria"
      aria-describedby={maxLength ? countId : undefined}
    >
      <FieldLabel label={label} isOptional={isOptional} />
      <span className={cx("nk-control", "nk-control--area", forceState === "focus" && "is-focus")}>
        <TextArea ref={setRefs} rows={rows} placeholder={placeholder} />
      </span>
      <FieldHelp
        description={description}
        errorMessage={errorMessage}
        isInvalid={isInvalid}
        count={maxLength ? <Count id={countId} length={length} max={maxLength} /> : undefined}
      />
      {maxLength ? (
        <span className="nk-sr" aria-live="polite">
          {announce}
        </span>
      ) : null}
    </TextField>
  );
});

const number = new Intl.NumberFormat("en-IN");

/** Speaks twice at most: on entering the last 10% ("600 characters left") and at the limit. Not on every keystroke. */
function useLimitAnnouncement(length: number, max?: number): string {
  const [message, setMessage] = useState("");
  const zone = !max ? "none" : length >= max ? "full" : max - length <= Math.ceil(max * 0.1) ? "near" : "ok";
  const last = useRef(zone);
  useEffect(() => {
    if (zone === last.current) return;
    last.current = zone;
    if (zone === "near" && max) setMessage(`${number.format(max - length)} characters left`);
    else if (zone === "full") setMessage("Character limit reached");
    else setMessage("");
  }, [zone, length, max]);
  return message;
}
