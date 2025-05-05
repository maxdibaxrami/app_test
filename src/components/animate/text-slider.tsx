import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

interface CSSMarqueeProps {
  children: React.ReactNode;
  duration?: number;          // seconds for one full loop
  disableAnimation?: boolean; // when true, pauses the marquee
}

export default function CSSMarquee({
  children,
  duration = 20,
  disableAnimation = false,
}: CSSMarqueeProps) {
  const { i18n } = useTranslation();

  // Determine RTL based on language
  const isRtl = useMemo(
    () => ["ar", "fa"].includes(i18n.language),
    [i18n.language]
  );

  // Repeat the content 4× for a seamless loop
  const repeats = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="inline-block">
          {children}
        </span>
      )),
    [children]
  );

  // Compose classes: omit animation classes if disabled
  const marqueeClasses = clsx(
    "inline-block w-full",
    !disableAnimation && "animate-marquee will-change-transform"
  );

  // Inline styles: include CSS var, flip for RTL, and control animation play state
  const marqueeStyle: React.CSSProperties = useMemo(
    () => ({
      "--marquee-duration": `${duration}s`,
      transform: isRtl ? "scaleX(-1)" : undefined,
      animationPlayState: disableAnimation ? "paused" : "running",
    }),
    [duration, isRtl, disableAnimation]
  );

  return (
    <div
      className={clsx(
        "overflow-hidden whitespace-nowrap relative",
        isRtl && "direction-rtl"
      )}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div className={marqueeClasses} style={marqueeStyle}>
        {repeats}
      </div>
    </div>
  );
}
