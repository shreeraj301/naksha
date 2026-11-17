import type { ReactNode } from "react";
import { Separator } from "react-aria-components";
import { cx } from "../cx";

export interface DividerProps {
  /** `strong` for a section break, default for groups inside a section. */
  variant?: "default" | "strong";
  orientation?: "horizontal" | "vertical";
  /** A mono heading set into the rule, like a drawing's sheet title: "Sheet 02 · Build". */
  label?: ReactNode;
}

/** A hairline between groups. A labelled divider names the section that follows. */
export function Divider({ variant = "default", orientation = "horizontal", label }: DividerProps) {
  if (label) {
    return (
      <div className="nk-rule--labeled" role="separator">
        {label}
      </div>
    );
  }
  return (
    <Separator
      orientation={orientation}
      className={cx("nk-rule", variant === "strong" && "nk-rule--strong", orientation === "vertical" && "nk-rule--v")}
    />
  );
}
