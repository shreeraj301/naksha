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
export type { PromptInputProps, PromptAttachment, PromptLevelProps } from "./components/PromptInput";

/** Naksha release, set by the build. */
export const version: string = typeof __NAKSHA_VERSION__ === "string" ? __NAKSHA_VERSION__ : "dev";

declare const __NAKSHA_VERSION__: string | undefined;
