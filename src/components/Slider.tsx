import { useRef } from "react";
import { mergeProps, useFocusRing, useHover, useLocale, useNumberFormatter, useSlider, useSliderThumb, VisuallyHidden } from "react-aria";
import { useSliderState } from "react-stately";
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
   * screen readers hear, so a person hears "40%", not "0.4".
   */
  formatOptions?: Intl.NumberFormatOptions;
  /**
   * Writes the value yourself, for what a number format cannot say: a clock time, "1:23 of 3:40".
   * It is both the text beside the label and what screen readers hear. Wins over `formatOptions`.
   */
  formatValue?: (value: number) => string;
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
 * Built on React Aria's slider hooks: a real range input inside the thumb, so arrow keys, Page Up and Down,
 * Home and End work, and the value is read in the same words it is written.
 */
export function Slider({
  label, value, defaultValue, onChange, onChangeEnd, minValue = 0, maxValue = 100, step = 1,
  formatOptions, formatValue, showValue = true, isDisabled, styles, forceState,
}: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const numberFormatter = useNumberFormatter(formatOptions);
  const { direction } = useLocale();
  // A number in, a number out: without a value or a default, React Stately would hand onChange an array.
  const state = useSliderState({
    label, minValue, maxValue, step, isDisabled, numberFormatter, onChange, onChangeEnd,
    value, defaultValue: value === undefined ? (defaultValue ?? minValue) : undefined,
  });
  const { groupProps, trackProps, labelProps, outputProps } = useSlider({ label, minValue, maxValue, step, isDisabled }, state, trackRef);
  const { thumbProps, inputProps, isDragging, isFocused } = useSliderThumb({ index: 0, trackRef, inputRef, isDisabled }, state);
  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled });

  const text = formatValue ? formatValue(state.getThumbValue(0)) : state.getThumbValueLabel(0);

  return (
    <div
      {...groupProps}
      style={layoutStyle(styles)}
      data-disabled={isDisabled || undefined}
      className={cx("nk-slider", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus", forceState === "dragging" && "is-dragging")}
    >
      <div className="nk-slider__head">
        {/* `for` points at the one input, so a disabled slider's label belongs to a disabled control. React Aria leaves it out
            for sliders with several thumbs (VoiceOver on iOS would read the label instead of each thumb's name); there is one here. */}
        <label {...labelProps} htmlFor={inputProps.id} className="nk-field__label">
          {label}
        </label>
        {showValue && (
          <output {...outputProps} className="nk-slider__value">
            {text}
          </output>
        )}
      </div>
      <div {...mergeProps(trackProps, hoverProps)} ref={trackRef} className="nk-slider__track" data-hovered={isHovered || undefined}>
        <div className="nk-slider__fill" style={{ [direction === "rtl" ? "right" : "left"]: 0, width: `${state.getThumbPercent(0) * 100}%` }} />
        <div
          {...thumbProps}
          className="nk-slider__thumb"
          data-dragging={isDragging || undefined}
          data-focused={isFocused || undefined}
          data-focus-visible={isFocusVisible || undefined}
        >
          <VisuallyHidden>
            <input ref={inputRef} {...mergeProps(inputProps, focusProps)} aria-valuetext={text} />
          </VisuallyHidden>
        </div>
      </div>
    </div>
  );
}
