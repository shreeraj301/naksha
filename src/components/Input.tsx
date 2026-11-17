import { forwardRef, type ReactNode } from "react";
import { Input as AriaInput, TextField } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { FieldHelp, FieldLabel, fieldClass, type FieldProps } from "./Field";
import { renderIcon, type IconName } from "./Icon";

export interface InputProps extends FieldProps {
  type?: "text" | "email" | "password" | "search" | "tel" | "url";
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric" | "decimal" | "search" | "none";
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  maxLength?: number;
  autoFocus?: boolean;
  /** 40 tall (44 under touch), or 32 for dense tools and filters. */
  size?: "sm" | "md";
  /** An icon name ("search") or a node, inside the field before the text. */
  iconStart?: IconName | ReactNode;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: "hover" | "focus";
}

/** A one-line text field with its label, help and error. Built on React Aria's TextField. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, description, errorMessage, isInvalid, isDisabled, isRequired, isOptional, placeholder, size = "md", iconStart, styles, forceState, onBlur, ...field },
  ref,
) {
  return (
    <TextField
      {...field}
      className={fieldClass(isInvalid, isDisabled)}
      style={layoutStyle(styles)}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationBehavior="aria"
      onBlur={onBlur ? () => onBlur() : undefined}
    >
      <FieldLabel label={label} isOptional={isOptional} />
      <span className={cx("nk-control", size === "sm" && "nk-control--sm", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}>
        {renderIcon(iconStart)}
        <AriaInput ref={ref} placeholder={placeholder} />
      </span>
      <FieldHelp description={description} errorMessage={errorMessage} isInvalid={isInvalid} />
    </TextField>
  );
});
