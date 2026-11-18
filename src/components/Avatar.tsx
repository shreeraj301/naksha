import { cx } from "../cx";
import { Icon } from "./Icon";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface AvatarProps {
  /** Whose it is. People show their initials; it is also the name read by screen readers. */
  name?: string;
  /** `agent` is square, with the sparkle: people are round, agents are square. */
  kind?: "person" | "agent";
  /** A photo. Initials show while it loads, and if it fails. */
  src?: string;
  /** 24, 32, 40 or 48. */
  size?: "xs" | "sm" | "md" | "lg";
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase();
}

/** A person or an agent. Without a name it shows the user icon. */
export function Avatar({ name, kind = "person", src, size = "md", styles }: AvatarProps) {
  const agent = kind === "agent";
  return (
    <span
      className={cx("nk-avatar", agent && "nk-avatar--agent", `nk-avatar--${size}`)}
      style={layoutStyle(styles)}
      {...(name ? { role: "img", "aria-label": agent ? `${name}, AI` : name } : { "aria-hidden": true })}
    >
      {src ? <img src={src} alt="" /> : agent ? <Icon name="sparkles" /> : name ? initials(name) : <Icon name="user" />}
    </span>
  );
}
