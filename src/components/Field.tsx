import type { ReactNode } from "react";
import { Label, Text } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";

/** What every labelled form control shares: one label, one line of help, one error. */
export interface FieldProps {
  /** Visible label. Every field has one; placeholder text is never the label. */
  label: string;
  /** Help under the field. Hidden while an error shows, so the person reads one message at a time. */
  description?: ReactNode;
  /** Shown, with the alert icon, while `isInvalid` is true. Say how to fix it, not that it is wrong. */
  errorMessage?: ReactNode;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  /** Marks the field "Optional" beside the label. Naksha marks the exception, and most fields are required. */
  isOptional?: boolean;
}

/** @internal */
export function fieldClass(isInvalid?: boolean, isDisabled?: boolean): string {
  return cx("nk-field", isInvalid && "nk-field--error", isDisabled && "nk-field--disabled");
}

/** @internal */
export function FieldLabel({ label, isOptional }: Pick<FieldProps, "label" | "isOptional">) {
  return (
    <Label className="nk-field__label">
      {label}
      {isOptional && (
        <>
          {" "}
          <span className="nk-field__opt">Optional</span>
        </>
      )}
    </Label>
  );
}

/** @internal Help line: the error (with its icon) or the description, then an optional count on the right. Label to field is 8, field to help is 6. */
export function FieldHelp({ description, errorMessage, isInvalid, count }: Pick<FieldProps, "description" | "errorMessage" | "isInvalid"> & { count?: ReactNode }) {
  const showError = Boolean(isInvalid && errorMessage);
  if (!showError && !description && !count) return null;
  return (
    <div className="nk-field__help">
      {showError ? (
        <>
          <Icon name="circle-alert" />
          <Text slot="errorMessage">{errorMessage}</Text>
        </>
      ) : description ? (
        <Text slot="description">{description}</Text>
      ) : null}
      {count}
    </div>
  );
}

const counter = new Intl.NumberFormat("en-IN");

/** @internal "124 / 6,000". Its id joins the field's description, so a screen reader hears the limit too. */
export function Count({ id, length, max }: { id: string; length: number; max: number }) {
  return (
    <span className={cx("nk-count", length >= max && "nk-count--full")} id={id}>
      {counter.format(length)} / {counter.format(max)}
    </span>
  );
}
