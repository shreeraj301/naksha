import { Button as AriaButton, Link as AriaLink } from "react-aria-components";
import { cx } from "../cx";

export interface SourceChipProps {
  /** Matches the superscript in the answer (<Cite n={1} />). */
  n: number;
  /** Where the claim came from: "Schedule A, clause 4.2", "Page 3", "gov.in/rent-act". Cut to one line. */
  label: string;
  /** Opens the source in place (scroll to the clause, open a panel). */
  onPress?: () => void;
  /** Or a link to it. */
  href?: string;
  /** Preview only. */
  forceState?: "hover" | "focus";
}

/** Ties a claim to where it came from. Numbered, so a reader matches it to the superscript in the answer. */
export function SourceChip({ n, label, onPress, href, forceState }: SourceChipProps) {
  const className = cx("nk-source", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus");
  // Read as "Source 1: Schedule A, clause 4.2". The extra words are hidden text, so the name still contains what is visible.
  const body = (
    <>
      <b>
        <span className="nk-sr">Source</span> {n}
        <span className="nk-sr">:</span>
      </b>{" "}
      <span>{label}</span>
    </>
  );
  return href ? (
    <AriaLink className={className} href={href}>
      {body}
    </AriaLink>
  ) : (
    <AriaButton className={className} onPress={onPress}>
      {body}
    </AriaButton>
  );
}

/** A citation mark in the answer's text, matching a SourceChip's number. */
export function Cite({ n }: { n: number }) {
  return <sup aria-label={`source ${n}`}>{n}</sup>;
}
