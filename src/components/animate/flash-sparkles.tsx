import { CSSProperties, ReactElement, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Sparkle {
  id: string;
  x: number; // Relative x and y values
  y: number;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
}

interface SparklesCustomIconTextProps {
  text: ReactElement;
  sparklesCount?: number;
  colors?: {
    first: string;
    second: string;
  };
  onClickGenerate?: () => void; // Callback for generating sparkles
}

const SparklesFlashIconText: React.FC<SparklesCustomIconTextProps> = ({
  text,
  colors = { first: "#FF6B6B", second: "#FFC107" },
  sparklesCount = 5,
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const generateIcon = (): Sparkle => {
    const angle = Math.random() * Math.PI * 2; // Random angle in radians
    const distance = Math.random() * 200; // Random distance from center
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const color = Math.random() > 0.5 ? colors.first : colors.second;
    const delay = Math.random() * 2;
    const scale = Math.random() * 2 + 0.85; // Larger scale
    const lifespan = Math.random() * 10 + 5;
    const id = `${x}-${y}-${Date.now()}`;
    return { id, x, y, color, delay, scale, lifespan };
  };

  const initializeIcons = () => {
    const newSparkles = Array.from({ length: sparklesCount }, generateIcon);
    setSparkles(newSparkles);
  };

  const updateIcons = () => {
    setSparkles((currentSparkles) =>
      currentSparkles.map((icon) => {
        if (icon.lifespan <= 0) {
          return generateIcon();
        } else {
          return { ...icon, lifespan: icon.lifespan - 0.1 };
        }
      }),
    );
  };

  useEffect(() => {
    initializeIcons();
    const interval = setInterval(updateIcons, 100);
    return () => clearInterval(interval);
  }, [colors.first, colors.second]);

  const addMoreIcons = () => {
    const newIcons = Array.from({ length: 10 }, generateIcon); // Add more sparkles
    setSparkles((prev) => [...prev, ...newIcons]);
  };

  return (
    <div
      className="relative"
      style={
        {
          "--sparkles-first-color": `${colors.first}`,
          "--sparkles-second-color": `${colors.second}`,
        } as CSSProperties
      }
    >
      {/* Render the custom icon sparkles in the background */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
        {sparkles.map((sparkle) => (
          <CustomIconSparkle key={sparkle.id} {...sparkle} />
        ))}
      </div>

      {/* Render the button or any other content */}
      <div className="relative z-10" onClick={addMoreIcons}> {/* Trigger icon generation on click */}
        {text}
      </div>
    </div>
  );
};

const CustomIconSparkle: React.FC<Sparkle> = ({ id, x, y, delay, scale }) => {
    const maxScale = 0.5;
  
    return (
      <motion.div
        key={id}
        className="pointer-events-none absolute z-0"
        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
        animate={{
          opacity: [0, 1, 0],
          x: [0, x],
          y: [0, y],
          scale: [0, Math.min(scale, maxScale)],
          rotate: [0, 360],
        }}
        transition={{ duration: 2, repeat: Infinity, delay }}
      >
          <p className="text-4xl">🔋</p>

      </motion.div>
    );
  };
  

export { SparklesFlashIconText };
