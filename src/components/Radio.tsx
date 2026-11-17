import type { ReactNode } from "react";
import { Label, Radio as AriaRadio, RadioGroup as AriaRadioGroup } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { FieldHelp } from "./Field";

export interface RadioGroupProps {
  /** The question the options answer. Leave out only with `aria-label`, when the context already says it. */
  label?: string;
  "aria-label"?: string;
  /** Two to five <Radio> options. More than five wants a Select. */
  children: ReactNode;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  description?: ReactNode;
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  name?: string;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
}

/** One choice from a few, all visible. Arrow keys move between options; Tab leaves the group. */
export function RadioGroup({ label, children, description, errorMessage, isInvalid, styles, ...rest }: RadioGroupProps) {
  return (
    <AriaRadioGroup {...rest} isInvalid={isInvalid} validationBehavior="aria" className="nk-radiogroup" style={layoutStyle(styles)}>
      {label && <Label className="nk-field__label">{label}</Label>}
      {children}
      <FieldHelp description={description} errorMessage={errorMessage} isInvalid={isInvalid} />
    </AriaRadioGroup>
  );
}

export interface RadioProps {
  value: string;
  children: ReactNode;
  /** A second, quieter line under the option. It is part of the option's name. */
  description?: ReactNode;
  isDisabled?: boolean;
  /** Preview only. */
  forceState?: "hover" | "focus";
}

export function Radio({ value, children, description, isDisabled, forceState }: RadioProps) {
  return (
    <AriaRadio value={value} isDisabled={isDisabled} className={cx("nk-radio", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}>
      <span className="nk-radio__box" />
      <span>
        {children}
        {description && <small>{description}</small>}
      </span>
    </AriaRadio>
  );
}
