import { useEffect, useRef, useState } from "react";
import { Input as AriaInput, TextField } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { FieldHelp, FieldLabel, fieldClass } from "./Field";
import type { ForcedState } from "./Button";

export interface CopyButtonProps {
  /** What goes on the clipboard. A function is called at the moment of the press, for values built late (a link with a fresh token). */
  value: string | (() => string);
  /** The label at rest. */
  children?: string;
  /** The label for a moment after copying. */
  copiedLabel?: string;
  /** What screen readers hear after copying: "Approval link copied." */
  announcement?: string;
  /** Names the field that shows the value when the browser refuses the clipboard: "Approval link". */
  valueLabel?: string;
  /** Icon only (a code block, a dense row). `children` becomes its name. */
  isIconOnly?: boolean;
  variant?: "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  onCopy?: (value: string) => void;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only: draw the state after a press. */
  forceResult?: "copied" | "refused";
  /** Preview only. */
  forceState?: ForcedState | ForcedState[];
}

/** How long "Copied" stays before the label returns. */
const SHOWN_MS = 2000;

/**
 * Copies a value and says so. The label changes to "Copied" for two seconds without changing the button's width, and a
 * screen reader hears the announcement. If the browser refuses the clipboard, the value appears in a read-only field,
 * selected, so it can be copied by hand.
 */
export function CopyButton({
  value, children = "Copy", copiedLabel = "Copied", announcement, valueLabel = "Text to copy", isIconOnly, variant = "secondary",
  size = "md", isDisabled, onCopy, styles, forceResult, forceState,
}: CopyButtonProps) {
  const [result, setResult] = useState<"idle" | "copied" | "refused">(forceResult ?? "idle");
  const [shown, setShown] = useState(typeof value === "string" ? value : "");
  const [said, setSaid] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (result === "refused" && !forceResult) { field.current?.focus(); field.current?.select(); } }, [result, forceResult]);

  const copy = async () => {
    const text = typeof value === "function" ? value() : value;
    setShown(text);
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(text);
      setResult("copied");
      setSaid(announcement ?? copiedLabel);
      onCopy?.(text);
      timer.current = setTimeout(() => { setResult("idle"); setSaid(""); }, SHOWN_MS);
    } catch {
      setResult("refused");
      setSaid("");
    }
  };

  const copied = result === "copied";
  const button = isIconOnly ? (
    <IconButton label={copied ? copiedLabel : children} icon={copied ? "check" : "copy"} variant={variant === "ghost" ? "ghost" : "secondary"} size={size} isDisabled={isDisabled} onPress={copy} forceState={forceState} />
  ) : (
    <Button variant={variant} size={size} iconStart={copied ? "check" : "copy"} isDisabled={isDisabled} onPress={copy} forceState={forceState}>
      {/* Both labels share one grid cell, so the button is as wide as the longer one and never shifts. */}
      <span className="nk-copy__labels">
        <span aria-hidden={copied || undefined} className={cx(copied && "nk-copy__off")}>{children}</span>
        <span aria-hidden={!copied || undefined} className={cx(!copied && "nk-copy__off")}>{copiedLabel}</span>
      </span>
    </Button>
  );

  return (
    <span className={cx("nk-copy", result === "refused" && "nk-copy--refused")} style={layoutStyle(styles)}>
      {button}
      <span className="nk-sr" role="status">{said}</span>
      {result === "refused" && (
        <TextField className={cx(fieldClass(), "nk-copy__fallback")} value={shown} isReadOnly>
          <FieldLabel label={valueLabel} />
          <span className="nk-control nk-control--sm">
            <AriaInput ref={field} onFocus={(e) => e.currentTarget.select()} />
          </span>
          <FieldHelp description="Your browser did not allow copying. The text is selected: copy it from here." />
        </TextField>
      )}
    </span>
  );
}
