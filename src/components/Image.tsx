import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button as AriaButton, Dialog, DialogTrigger, Modal as AriaModal, ModalOverlay } from "react-aria-components";
import { cx } from "../cx";
import { layoutStyle, type LayoutStyles } from "../styles";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";

export interface ImageProps {
  src: string;
  /** What the picture shows, for anyone who cannot see it. `""` when it only decorates and the text nearby says it all. */
  alt: string;
  /** Width over height: "3/2", "4/3", "1/1", "16/10". The frame takes this shape before the file arrives, so nothing below it jumps. */
  ratio: string;
  /** The same picture at several widths: "kitchen-480.jpg 480w, kitchen-1200.jpg 1200w". */
  srcSet?: string;
  /** How wide it is drawn, so the browser picks the right file from `srcSet`: "(min-width: 600px) 30rem, 100vw". */
  sizes?: string;
  /** `cover` fills the frame and crops; `contain` shows all of it, on the placeholder colour. */
  fit?: "cover" | "contain";
  /** A line under the picture: what it is, where, when. */
  caption?: ReactNode;
  /** Load at once instead of when it nears the screen. Only for the first picture a page shows. */
  priority?: boolean;
  /** Tap or click to see it full size, on a plain sheet over the page. Escape, the close button or a tap closes it. */
  isZoomable?: boolean;
  /** The file to show full size. Defaults to `src` with `srcSet` at full width. */
  zoomSrc?: string;
  /** Layout only (ADR 0009). */
  styles?: LayoutStyles;
  /** Preview only. */
  forceState?: "loading" | "error" | "hover" | "focus";
}

type Load = "idle" | "loading" | "loaded" | "error";

/**
 * A picture that holds its shape while it loads, with a hairline edge and an optional caption.
 * With `isZoomable` it is a button that opens the picture full size in a dialog.
 */
export function Image({ src, alt, ratio, srcSet, sizes, fit = "cover", caption, priority, isZoomable, zoomSrc, styles, forceState }: ImageProps) {
  const img = useRef<HTMLImageElement>(null);
  // "idle" until mounted, so a server-rendered page shows the picture even before scripts run.
  const [load, setLoad] = useState<Load>("idle");
  useLayoutEffect(() => {
    const el = img.current;
    if (!el) return;
    if (!el.complete) setLoad("loading");
    else setLoad(el.naturalWidth > 0 ? "loaded" : "error");
  }, [src, srcSet]);
  const state = forceState === "loading" || forceState === "error" ? forceState : load;

  const picture = (
    <>
      <img
        ref={img}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoad("loaded")}
        onError={() => setLoad("error")}
      />
      {state === "error" && (
        <span className="nk-image__error">
          <Icon name="circle-alert" />
          Image did not load
        </span>
      )}
      {isZoomable && state !== "error" && (
        <span className="nk-image__badge" aria-hidden="true">
          <Icon name="zoom-in" />
        </span>
      )}
    </>
  );
  const frameClass = cx("nk-image__frame", fit === "contain" && "nk-image__frame--contain");
  const frameProps = { "data-state": state, style: { aspectRatio: ratio } };

  const frame = isZoomable ? (
    <DialogTrigger>
      <AriaButton
        {...frameProps}
        aria-label={alt ? `${alt}, view full size` : "View full size"}
        className={cx(frameClass, "nk-image__zoom", forceState === "hover" && "is-hover", forceState === "focus" && "is-focus")}
      >
        {picture}
      </AriaButton>
      <ModalOverlay className="nk-overlay nk-overlay--viewer" isDismissable>
        <AriaModal className="nk-viewer-frame">
          <Dialog className="nk-viewer" aria-label={alt || "Picture, full size"}>
            {({ close }) => (
              <>
                <div className="nk-viewer__close">
                  <IconButton label="Close" icon="x" variant="ghost" onPress={close} />
                </div>
                {/* A tap anywhere, the picture included, closes it, like the products that zoom on tap. Keyboard users have Escape and Close. */}
                <div className="nk-viewer__stage" onClick={close}>
                  <figure className="nk-viewer__figure">
                    <img src={zoomSrc ?? src} srcSet={zoomSrc ? undefined : srcSet} sizes={zoomSrc ? undefined : "100vw"} alt={alt} />
                    {caption && <figcaption className="nk-image__caption">{caption}</figcaption>}
                  </figure>
                </div>
              </>
            )}
          </Dialog>
        </AriaModal>
      </ModalOverlay>
    </DialogTrigger>
  ) : (
    <div {...frameProps} className={frameClass}>
      {picture}
    </div>
  );

  return caption ? (
    <figure className="nk-image" style={layoutStyle(styles)}>
      {frame}
      <figcaption className="nk-image__caption">{caption}</figcaption>
    </figure>
  ) : (
    <div className="nk-image" style={layoutStyle(styles)}>
      {frame}
    </div>
  );
}
