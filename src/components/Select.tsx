import type { Key } from "react";
import { Button as AriaButton, ListBox, ListBoxItem, Popover, Select as AriaSelect, SelectValue } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { FieldHelp, FieldLabel, fieldClass, type FieldProps } from "./Field";
import { Icon } from "./Icon";

export interface SelectOption {
  id: string;
  label: string;
}

export interface SelectProps extends FieldProps {
  /** Up to about seven choices. More than that wants search (a combobox, later). Two or three short ones read better as a SegmentedControl. */
  options: SelectOption[];
  /** Selected option id. Leave out and use `defaultValue` for uncontrolled. */
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (id: string) => void;
  /** Shown until something is chosen, in the placeholder colour. */
  placeholder?: string;
  name?: string;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. "open" draws the list in the flow under the trigger. */
  forceState?: "hover" | "focus" | "open";
}

/** Pick one from a short list. The trigger is a button; the list is a React Aria ListBox in a popover as wide as the field. */
export function Select({
  label, description, errorMessage, isInvalid, isDisabled, isRequired, isOptional, options, value, defaultValue, onChange, placeholder, name, styles, forceState,
}: SelectProps) {
  const forcedOpen = forceState === "open";
  const shown = value ?? defaultValue;
  const list = (
    <ListBox className={cx("nk-menu", "nk-menu--select", forcedOpen && "nk-menu--inline")}>
      {options.map((o) => (
        <ListBoxItem
          key={o.id}
          id={o.id}
          textValue={o.label}
          className={({ isFocused }) => cx("nk-menu__item", (isFocused || (forcedOpen && o.id === shown)) && "is-hover")}
        >
          {({ isSelected }) => (
            <>
              <span>{o.label}</span>
              {isSelected && <Icon name="check" className="nk-i nk-menu__check" />}
            </>
          )}
        </ListBoxItem>
      ))}
    </ListBox>
  );
  return (
    <AriaSelect
      className={fieldClass(isInvalid, isDisabled)}
      style={layoutStyle(styles)}
      selectedKey={value}
      defaultSelectedKey={defaultValue}
      onSelectionChange={(key: Key | null) => key != null && onChange?.(String(key))}
      placeholder={placeholder}
      name={name}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isRequired={isRequired}
      validationBehavior="aria"
    >
      <FieldLabel label={label} isOptional={isOptional} />
      <AriaButton
        className={cx(
          "nk-control",
          "nk-control--select",
          forceState === "hover" && "is-hover",
          (forceState === "focus" || forcedOpen) && "is-focus",
          forcedOpen && "is-open",
        )}
      >
        <SelectValue className="nk-control__value" />
        <span className="nk-chev">
          <Icon name="chevron-down" />
        </span>
      </AriaButton>
      <FieldHelp description={description} errorMessage={errorMessage} isInvalid={isInvalid} />
      {forcedOpen ? list : <Popover offset={4} placement="bottom start">{list}</Popover>}
    </AriaSelect>
  );
}
