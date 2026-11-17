import type { ReactNode } from "react";
import { Button as AriaButton, Tag as AriaTag, TagGroup as AriaTagGroup, TagList } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";

export type TagTone = "neutral" | "outline" | "inverse" | "highlight" | "success" | "warning" | "danger" | "info";

export interface TagProps {
  children: ReactNode;
  tone?: TagTone;
  /** A small square before the text, for a live status: "Live", "Due". */
  hasDot?: boolean;
}

/** A short label: a category, a status. Not interactive; for tags people remove, use TagGroup. */
export function Tag({ children, tone = "neutral", hasDot }: TagProps) {
  return (
    <span className={cx("nk-tag", tone !== "neutral" && `nk-tag--${tone}`)}>
      {hasDot && <span className="nk-tag__dot" />}
      {children}
    </span>
  );
}

export interface TagGroupProps {
  /** Names the set: "Categories". */
  label: string;
  items: Array<{ id: string; label: string }>;
  /** Each tag gets a remove button, and Delete or Backspace removes the focused tag. */
  onRemove?: (ids: string[]) => void;
  tone?: TagTone;
}

/** A set of tags people can move through with arrow keys and remove: filters, chosen categories. */
export function TagGroup({ label, items, onRemove, tone = "outline" }: TagGroupProps) {
  return (
    <AriaTagGroup aria-label={label} onRemove={onRemove ? (keys) => onRemove([...keys].map(String)) : undefined} className="nk-taggroup">
      <TagList className="nk-taggroup__list">
        {items.map((t) => (
          <AriaTag key={t.id} id={t.id} textValue={t.label} className={cx("nk-tag", tone !== "neutral" && `nk-tag--${tone}`, onRemove && "nk-tag--remove")}>
            {t.label}
            {onRemove && (
              <AriaButton slot="remove">
                <Icon name="x" />
              </AriaButton>
            )}
          </AriaTag>
        ))}
      </TagList>
    </AriaTagGroup>
  );
}
