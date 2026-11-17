import { ICONS, type IconName } from "../icons.generated";

export type { IconName };

export interface IconProps {
  /** One of Naksha's drawn icons. */
  name: IconName;
  /** Give a label only when the icon carries meaning on its own. Otherwise it is hidden from assistive tech. */
  label?: string;
  className?: string;
}

/** A Naksha icon: 24px grid, 1.5px stroke, square caps, sized by its parent (`--ic` in controls). */
export function Icon({ name, label, className }: IconProps) {
  return (
    <svg
      className={className ?? "nk-i"}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

/** Accepts an icon name or any node, so props like `iconStart="plus"` stay short. */
export function renderIcon(icon: IconName | React.ReactNode | undefined): React.ReactNode {
  if (typeof icon === "string" && icon in ICONS) return <Icon name={icon as IconName} />;
  return icon ?? null;
}
