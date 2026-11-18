import { Label, Slider as AriaSlider, SliderOutput, SliderThumb, SliderTrack, useLocale } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";

export interface SliderProps {
  /** What the number is: "Volume", "Budget", "Playback position". Always visible; screen readers read it as the name. */
  label: string;
  value?: number;
  defaultValue?: number;
  /** Every step while dragging or pressing an arrow key. */
  onChange?: (value: number) => void;
  /** Once, when the drag or key press ends. Save or seek here, not in `onChange`. */
  onChangeEnd?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  /** How far one arrow key moves. Page Up and Page Down move a tenth of the range. */
  step?: number;
  /**
   * How the value is written and read aloud: `{ style: "percent" }`, `{ style: "currency", currency: "INR" }`,
   * `{ style: "unit", unit: "second", unitDisplay: "long" }`. The same text shows beside the label and is what
   * screen readers hear, so a person hears "40 percent", not "0.4".
   */
  formatOptions?: Intl.NumberFormatOptions;
  /** Show the value beside the label. Hide it only when the value shows somewhere else nearby. */
  showValue?: boolean;
  isDisabled?: boolean;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: "hover" | "focus" | "dragging";
}

/**
 * A number picked from a range by dragging or with arrow keys: volume, a budget ceiling, a playback position.
 * React Aria's Slider: a real range input inside the thumb, so arrow keys, Page Up and Down, Home and End work,
 * and the value is read in the same words it is written.
 */
export function Slider({ label, showValue = true, styles, forceState, ...rest }: SliderProps) {
  // The fill starts from the same edge React Aria measures the thumb from: its locale's direction, not the page's dir attribute.
  const { direction } = useLocale();
  return (
    <AriaSlider
      {...rest}
      style={layoutStyle(styles)}
      className={cx("nk-slider", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus", forceState === "dragging" && "is-dragging")}
    >
      <div className="nk-slider__head">
        <Label className="nk-field__label">{label}</Label>
        {showValue && <SliderOutput className="nk-slider__value" />}
      </div>
      <SliderTrack className="nk-slider__track">
        {({ state }) => (
          <>
            <div className="nk-slider__fill" style={{ [direction === "rtl" ? "right" : "left"]: 0, width: `${state.getThumbPercent(0) * 100}%` }} />
            <SliderThumb className="nk-slider__thumb" />
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}
