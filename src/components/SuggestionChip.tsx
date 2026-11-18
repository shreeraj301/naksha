import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface SuggestionChipProps {
  /** A prompt written the way the person would ask it: "Explain clause 4.2". */
  children: ReactNode;
  /** Usually sends the prompt, or puts it in the composer when it needs editing. */
  onPress?: () => void;
  isDisabled?: boolean;
  /** Preview only. */
  forceState?: "hover" | "focus";
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

/** A prompt starter. Show up to three, before the first message or after an answer, and hide them once the person types. */
export function SuggestionChip({ children, onPress, isDisabled, forceState, styles }: SuggestionChipProps) {
  return (
    <AriaButton
      className={cx("nk-chip", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}
      onPress={onPress}
      isDisabled={isDisabled}
      style={layoutStyle(styles)}
    >
      <Icon name="arrow-right" />
      {children}
    </AriaButton>
  );
}
