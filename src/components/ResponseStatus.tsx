import { useId, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { cx } from "../cx";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";
import { layoutStyle, type LayoutStyles } from "../styles";

export type StepStatus = "pending" | "running" | "done" | "failed";

export interface ResponseStep {
  /** What the agent is doing, as a verb phrase: "Reading clause 4.2". */
  label: string;
  status: StepStatus;
  /** A short fact in mono: "3 pages", "2 matches", "timed out". */
  detail?: string;
}

export interface ResponseStatusProps {
  steps: ResponseStep[];
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  /** Layout only: margin, width, placement, position (ADR 0009). */
  styles?: LayoutStyles;
}

const SAID: Record<StepStatus, string> = { pending: "waiting", running: "in progress", done: "done", failed: "failed" };

function StepMark({ status }: { status: StepStatus }) {
  if (status === "done") return <Icon name="check" />;
  if (status === "failed") return <Icon name="circle-alert" />;
  if (status === "running") return <Spinner size="sm" />;
  return <span className="nk-trace__wait" aria-hidden="true" />;
}

/**
 * The trace of what an agent did for a reply: a quiet toggle ("2 of 4 steps") that opens the list of steps,
 * each pending, running, done or failed. It replaces the bare thinking dots, so people can see the work.
 */
export function ResponseStatus({ steps, isExpanded, defaultExpanded = false, onExpandedChange, styles }: ResponseStatusProps) {
  const [inner, setInner] = useState(defaultExpanded);
  const open = isExpanded ?? inner;
  const id = useId();
  const done = steps.filter((s) => s.status === "done").length;
  const failed = steps.filter((s) => s.status === "failed").length;
  const toggle = () => {
    if (isExpanded === undefined) setInner(!open);
    onExpandedChange?.(!open);
  };
  return (
    <div className="nk-status" style={layoutStyle(styles)}>
      <AriaButton className="nk-status__toggle" aria-expanded={open} aria-controls={open ? id : undefined} onPress={toggle}>
        {open ? "Hide steps" : `${done} of ${steps.length} steps${failed ? `, ${failed} failed` : ""}`}
        <Icon name="chevron-down" />
      </AriaButton>
      {open && (
        <ol id={id} className="nk-trace">
          {steps.map((s, i) => (
            <li key={i} className={cx("nk-trace__step", `nk-trace__step--${s.status}`)}>
              <StepMark status={s.status} />
              <span>
                {s.label}
                <span className="nk-sr">, {SAID[s.status]}</span>
                {s.detail && <small>{s.detail}</small>}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
