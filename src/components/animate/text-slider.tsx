import { useTranslation } from "react-i18next";

interface CSSMarqueeProps {
  children: React.ReactNode;
  duration?: number;   // seconds for one full loop
}

export default function CSSMarquee({
  children,
  duration = 20,
}: CSSMarqueeProps) {
  const { i18n } = useTranslation();
  const isRtl = ["ar", "fa"].includes(i18n.language);

  // We’ll repeat the text 4× so that the loop is seamless.
  const repeats = Array.from({ length: 4 }, (_, i) => <span key={i} className="inline-block">{children}</span>);

  return (
    <div
      className={`
        overflow-hidden whitespace-nowrap relative
        ${isRtl ? "direction-rtl" : ""}
      `}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <div
        className="inline-block w-full animate-marquee will-change-transform"
        // flip direction for RTL
        style={isRtl 
          ? { transform: "scaleX(-1)" } 
          : undefined
        }
      >
        {repeats}
      </div>
    </div>
  );
}
