"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useInView, useReducedMotion } from "motion/react";

interface CinematicVideoProps {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  /** Eager-load and begin buffering immediately (hero background). */
  priority?: boolean;
  /** Autoplay + loop + muted forever (hero / section backgrounds). */
  autoplay?: boolean;
  /** Play muted while hovered, pause on leave (project cards). */
  playOnHover?: boolean;
  /** Render only the still frame, never a <video> element. */
  still?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** Reports the video's native resolution once its metadata loads. */
  onResolution?: (width: number, height: number) => void;
}

export interface CinematicVideoHandle {
  play: () => void;
  pause: () => void;
}

/**
 * Cinematic <video> wrapper.
 *
 * - Lazy: the <video> element only mounts once the frame nears the viewport,
 *   so below-the-fold projects ship a poster first.
 * - Poster-first: the still frame stays up and crossfades once the video is
 *   ready to play.
 * - Reduced motion: autoplay never happens; posters remain.
 *
 * Callers can drive playback directly through the forwarded ref handle
 * (e.g. a showreel play/pause button).
 */
export const CinematicVideo = forwardRef<
  CinematicVideoHandle,
  CinematicVideoProps
>(function CinematicVideo(
  {
    src,
    poster,
    alt = "",
    className = "",
    priority = false,
    autoplay = false,
    playOnHover = false,
    still = false,
    onPlayingChange,
    onResolution,
  },
  ref
) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInView(frameRef, { margin: "600px 0px", once: true });

  // Guard against crossed media fields: an image pasted into a "video" field
  // renders instantly as a still instead of a forever-loading <video>;
  // a video pasted into a "poster" field is ignored so it can't hang the page.
  const isImageSrc = /\.(jpe?g|png|webp|gif|avif)$/i.test(src);
  const isVideoPoster = /\.(m4v|mov|webm|mp4)$/i.test(poster || "");
  const describedStill = isImageSrc || still || reduce;
  const effectiveStill = describedStill;

  const play = (withControl = false) => {
    const v = videoRef.current;
    if (!v) return;
    const attempt = v.play();
    if (attempt) attempt.catch(() => undefined);
    if (withControl) onPlayingChange?.(true);
  };

  const reportResolution = (width: number, height: number) => {
    if (width > 0 && height > 0) onResolution?.(width, height);
  };

  const pause = (withControl = false) => {
    videoRef.current?.pause();
    if (withControl) onPlayingChange?.(false);
  };

  useImperativeHandle(ref, () => ({
    play: () => play(true),
    pause: () => pause(true),
  }));

  const showVideo = !effectiveStill && (priority || inView) && !autoplay;
  const showAutoVideo = !effectiveStill && autoplay;

  return (
    <div
      ref={frameRef}
      onPointerEnter={() => playOnHover && play()}
      className={`relative h-full w-full overflow-hidden bg-cine-black ${className}`}
    >
      {poster && !isVideoPoster ? (
        // Plain <img> keeps the heavy poster off the Next image pipeline;
        // it is hot-linked from the media CDN in lib/site.ts & lib/projects.ts.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : isImageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover opacity-100"
        />
      ) : null}

      {showAutoVideo ? (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          aria-hidden={!alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          onLoadedMetadata={(e) =>
            reportResolution(e.currentTarget.videoWidth, e.currentTarget.videoHeight)
          }
          onPlay={() => onPlayingChange?.(true)}
          onPause={() => onPlayingChange?.(false)}
        />
      ) : null}

      {showVideo ? (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload={playOnHover ? "auto" : "metadata"}
          aria-hidden={!alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          onCanPlay={() => setReady(true)}
          onLoadedData={() => setReady(true)}
          onLoadedMetadata={(e) =>
            reportResolution(e.currentTarget.videoWidth, e.currentTarget.videoHeight)
          }
          onPlay={() => onPlayingChange?.(true)}
          onPause={() => onPlayingChange?.(false)}
        />
      ) : null}
    </div>
  );
});