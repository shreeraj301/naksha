import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";

export interface SuggestionChipProps {
  /** A prompt written the way the person would ask it: "Explain clause 4.2". */
  children: ReactNode;
  /** Usually sends the prompt, or puts it in the composer when it needs editing. */
  onPress?: () => void;
  isDisabled?: boolean;
  /** Preview only. */
  forceState?: "hover" | "focus";
}

/** A prompt starter. Show up to three, before the first message or after an answer, and hide them once the person types. */
export function SuggestionChip({ children, onPress, isDisabled, forceState }: SuggestionChipProps) {
  return (
    <AriaButton
      className={cx("nk-chip", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}
      onPress={onPress}
      isDisabled={isDisabled}
    >
      <Icon name="arrow-right" />
      {children}
    </AriaButton>
  );
}
