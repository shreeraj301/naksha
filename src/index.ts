export { layoutStyle, LAYOUT_PROPERTIES } from "./styles";
export type { LayoutStyles, LayoutProperty } from "./styles";

export { Icon } from "./components/Icon";
export type { IconProps, IconName } from "./components/Icon";
export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";
export { Button } from "./components/Button";
export type { ButtonProps, ForcedState } from "./components/Button";
export { IconButton } from "./components/IconButton";
export type { IconButtonProps } from "./components/IconButton";
export { PromptInput, PromptLevel } from "./components/PromptInput";
export type { PromptInputProps, PromptAttachment, PromptLevelProps, PromptLevelOption } from "./components/PromptInput";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";
export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";
export { Select } from "./components/Select";
export type { SelectProps, SelectOption } from "./components/Select";
export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";
export { RadioGroup, Radio } from "./components/Radio";
export type { RadioGroupProps, RadioProps } from "./components/Radio";
export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";
export { SegmentedControl } from "./components/SegmentedControl";
export type { SegmentedControlProps, SegmentedOption } from "./components/SegmentedControl";
export type { FieldProps } from "./components/Field";

export { DropdownMenu } from "./components/DropdownMenu";
export type { DropdownMenuProps, MenuAction, MenuSeparator, MenuEntry } from "./components/DropdownMenu";
export { Modal, ModalTrigger } from "./components/Modal";
export type { ModalProps } from "./components/Modal";
export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";
export { toast, Toaster, Toast } from "./components/Toast";
export type { ToasterProps, ToastProps, ToastOptions, ToastAction, ToastTone } from "./components/Toast";

/** Naksha release, set by the build. */
export const version: string = typeof __NAKSHA_VERSION__ === "string" ? __NAKSHA_VERSION__ : "dev";

declare const __NAKSHA_VERSION__: string | undefined;
