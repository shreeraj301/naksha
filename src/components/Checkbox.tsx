import type { ReactNode } from "react";
import { Checkbox as AriaCheckbox } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface CheckboxProps {
  /** The label. Say what turns on, as a statement: "Weekly digest", not "Enable weekly digest?". */
  children: ReactNode;
  /** A second, quieter line under the label. It is part of the checkbox's name. */
  description?: ReactNode;
  isSelected?: boolean;
  defaultSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  /** Some, not all, of a group below it is on. Shows a dash; a press sets it on. */
  isIndeterminate?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  name?: string;
  value?: string;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: "hover" | "focus";
}

/** An on or off choice that takes effect when the form is sent. For a setting that applies at once, use Switch. */
export function Checkbox({ children, description, isInvalid, styles, forceState, ...rest }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...rest}
      isInvalid={isInvalid}
      validationBehavior="aria"
      style={layoutStyle(styles)}
      className={cx("nk-check", isInvalid && "nk-check--error", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}
    >
      <span className="nk-check__box" />
      <span>
        {children}
        {description && <small>{description}</small>}
      </span>
    </AriaCheckbox>
  );
}
