import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";

// Scene timing constants (in frames)
const SCENE_1_START = 0;
const SCENE_2_START = 60;
const SCENE_3_START = 105;
const SCENE_4_START = 165;
const SCENE_5_START = 210;
const SCENE_5_END = 270;

// Metrics text for Scene 1
const metrics = ["Sleep", "Recovery", "Heart Rate", "VO₂ Max"];

// System loop words for Scene 5
const systemWords = ["Measure", "Improve", "Track"];

// Ring constants (shared across scenes)
const RING_RADIUS = 100;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Styles with improved contrast
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#0d0d1a",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#ffffff",
  },
  metricsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 32, // Increased spacing
  },
  metricText: {
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: 1,
    margin: 0,
    color: "rgba(255, 255, 255, 0.7)", // 70% white for first 3
  },
  metricTextLast: {
    fontSize: 48,
    fontWeight: 500, // Slightly heavier
    letterSpacing: 1,
    margin: 0,
    color: "rgba(255, 255, 255, 0.88)", // 88% white for last
  },
  missingText: {
    fontSize: 44,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "#ffffff",
  },
  swimScoreText: {
    fontSize: 54,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#ffffff",
    margin: 0,
  },
  taglineTextPrimary: {
    fontSize: 42, // Increased by ~30%
    fontWeight: 500,
    color: "#ffffff", // Full white
    textAlign: "center" as const,
    margin: 0,
  },
  taglineTextSecondary: {
    fontSize: 28,
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.5)", // Muted
    textAlign: "center" as const,
    margin: 0,
  },
  systemWord: {
    fontSize: 38,
    fontWeight: 500,
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
  },
};

// Scene 1: What Men Already Track
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const lineDelay = 9; // Faster sequence
  const animDuration = 12; // Snappier animation

  return (
    <div style={styles.metricsContainer}>
      {metrics.map((metric, index) => {
        const lineStart = SCENE_1_START + index * lineDelay;
        const isLast = index === metrics.length - 1;

        const opacity = interpolate(
          frame,
          [lineStart, lineStart + animDuration],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        const translateY = interpolate(
          frame,
          [lineStart, lineStart + animDuration],
          [10, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        return (
          <p
            key={metric}
            style={{
              ...(isLast ? styles.metricTextLast : styles.metricText),
              opacity,
              transform: `translateY(${translateY}px)`,
            }}
          >
            {metric}
          </p>
        );
      })}
    </div>
  );
};

// Scene 2: Something Is Missing
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const moveStart = SCENE_2_START;
  const moveDuration = 20; // Slightly faster

  // Metrics group animation - more aggressive
  const groupTranslateY = interpolate(
    frame,
    [moveStart, moveStart + moveDuration],
    [0, -32], // Increased movement
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const groupOpacity = interpolate(
    frame,
    [moveStart, moveStart + moveDuration],
    [1, 0.28], // More aggressive fade
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // "One metric missing" text animation
  const textStart = moveStart + 12;
  const missingOpacity = interpolate(
    frame,
    [textStart, textStart + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const missingTranslateY = interpolate(
    frame,
    [textStart, textStart + 14],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <>
      {/* Metrics group that moves up and fades */}
      <div
        style={{
          ...styles.metricsContainer,
          opacity: groupOpacity,
          transform: `translateY(${groupTranslateY}px)`,
        }}
      >
        {metrics.map((metric, index) => {
          const isLast = index === metrics.length - 1;
          return (
            <p
              key={metric}
              style={isLast ? styles.metricTextLast : styles.metricText}
            >
              {metric}
            </p>
          );
        })}
      </div>

      {/* "One metric missing" text */}
      <div
        style={{
          position: "absolute",
          bottom: "36%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: missingOpacity,
          transform: `translateY(${missingTranslateY}px)`,
        }}
      >
        <p style={styles.missingText}>One metric missing</p>
      </div>
    </>
  );
};

// Scene 3: The Scroll Stop
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  // Fade out previous content
  const fadeOutStart = SCENE_3_START;
  const fadeOutOpacity = interpolate(
    frame,
    [fadeOutStart, fadeOutStart + 12],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Ring draw animation with overshoot
  const ringStart = SCENE_3_START + 8;
  const ringDuration = 36;
  const ringSettleDuration = 5;

  // Overshoot to 82%, then settle to 80%
  const ringProgress = interpolate(
    frame,
    [
      ringStart,
      ringStart + ringDuration,
      ringStart + ringDuration + ringSettleDuration,
    ],
    [0, 0.82, 0.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const strokeDashoffset = RING_CIRCUMFERENCE * (1 - ringProgress);

  // SwimScore text animation - starts at ~70% ring completion (earlier)
  const textStart = ringStart + Math.floor(ringDuration * 0.7);
  const swimScoreOpacity = interpolate(
    frame,
    [textStart, textStart + 12],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const swimScoreTranslateY = interpolate(
    frame,
    [textStart, textStart + 12],
    [6, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <>
      {/* Fading previous scene */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOutOpacity,
        }}
      >
        <div
          style={{
            ...styles.metricsContainer,
            opacity: 0.28,
            transform: "translateY(-32px)",
          }}
        >
          {metrics.map((metric, index) => {
            const isLast = index === metrics.length - 1;
            return (
              <p
                key={metric}
                style={isLast ? styles.metricTextLast : styles.metricText}
              >
                {metric}
              </p>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "36%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p style={styles.missingText}>One metric missing</p>
        </div>
      </div>

      {/* Ring and SwimScore */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        {/* Circular ring */}
        <svg
          width={RING_RADIUS * 2 + 20}
          height={RING_RADIUS * 2 + 20}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={RING_RADIUS + 10}
            cy={RING_RADIUS + 10}
            r={RING_RADIUS}
            fill="none"
            stroke="#ffffff"
            strokeWidth={3}
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* SwimScore text */}
        <p
          style={{
            ...styles.swimScoreText,
            opacity: swimScoreOpacity,
            transform: `translateY(${swimScoreTranslateY}px)`,
          }}
        >
          SwimScore™
        </p>
      </div>
    </>
  );
};

// Scene 4: What It Is
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  // Ring stays visible but fades slightly
  const ringOpacity = interpolate(
    frame,
    [SCENE_4_START, SCENE_4_START + 8],
    [1, 0.75],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Tagline animation
  const taglineStart = SCENE_4_START + 4;
  const taglineOpacity = interpolate(
    frame,
    [taglineStart, taglineStart + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const taglineTranslateY = interpolate(
    frame,
    [taglineStart, taglineStart + 14],
    [6, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // "Measured." animation (slightly delayed)
  const measuredStart = taglineStart + 10;
  const measuredOpacity = interpolate(
    frame,
    [measuredStart, measuredStart + 12],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const strokeDashoffset = RING_CIRCUMFERENCE * 0.2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      {/* Ring (persistent from Scene 3) */}
      <svg
        width={RING_RADIUS * 2 + 20}
        height={RING_RADIUS * 2 + 20}
        style={{ transform: "rotate(-90deg)", opacity: ringOpacity }}
      >
        <circle
          cx={RING_RADIUS + 10}
          cy={RING_RADIUS + 10}
          r={RING_RADIUS}
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* SwimScore text */}
      <p style={styles.swimScoreText}>SwimScore™</p>

      {/* Tagline - "Male fertility health metric" */}
      <p
        style={{
          ...styles.taglineTextPrimary,
          opacity: taglineOpacity,
          transform: `translateY(${taglineTranslateY}px)`,
        }}
      >
        Male fertility health metric
      </p>

      {/* "Measured." - qualifier */}
      <p
        style={{
          ...styles.taglineTextSecondary,
          opacity: measuredOpacity,
        }}
      >
        Measured.
      </p>
    </div>
  );
};

// Scene 5: System Loop
const Scene5: React.FC<{ frame: number }> = ({ frame }) => {
  const wordDelay = 9; // Frames between words
  const animDuration = 12;

  // Ring with subtle pulse on "Track"
  const trackStartFrame = SCENE_5_START + 2 * wordDelay;
  const ringScale = interpolate(
    frame,
    [trackStartFrame, trackStartFrame + 8, trackStartFrame + 16],
    [1, 1.03, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const strokeDashoffset = RING_CIRCUMFERENCE * 0.2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      {/* Ring with pulse */}
      <svg
        width={RING_RADIUS * 2 + 20}
        height={RING_RADIUS * 2 + 20}
        style={{
          transform: `rotate(-90deg) scale(${ringScale})`,
          opacity: 0.75,
        }}
      >
        <circle
          cx={RING_RADIUS + 10}
          cy={RING_RADIUS + 10}
          r={RING_RADIUS}
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* SwimScore text */}
      <p style={{ ...styles.swimScoreText, opacity: 0.9 }}>SwimScore™</p>

      {/* System words */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginTop: 12,
        }}
      >
        {systemWords.map((word, index) => {
          const wordStart = SCENE_5_START + index * wordDelay;

          const opacity = interpolate(
            frame,
            [wordStart, wordStart + animDuration],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          const translateY = interpolate(
            frame,
            [wordStart, wordStart + animDuration],
            [6, 0],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }
          );

          return (
            <p
              key={word}
              style={{
                ...styles.systemWord,
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              {word}
            </p>
          );
        })}
      </div>
    </div>
  );
};

// Main SwimScoreReel Component
export const SwimScoreReel: React.FC = () => {
  const frame = useCurrentFrame();

  // Determine which scene to render
  const isScene1 = frame >= SCENE_1_START && frame < SCENE_2_START;
  const isScene2 = frame >= SCENE_2_START && frame < SCENE_3_START;
  const isScene3 = frame >= SCENE_3_START && frame < SCENE_4_START;
  const isScene4 = frame >= SCENE_4_START && frame < SCENE_5_START;
  const isScene5 = frame >= SCENE_5_START && frame <= SCENE_5_END;

  return (
    <AbsoluteFill style={styles.container}>
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isScene1 && <Scene1 frame={frame} />}
        {isScene2 && <Scene2 frame={frame} />}
        {isScene3 && <Scene3 frame={frame} />}
        {isScene4 && <Scene4 frame={frame} />}
        {isScene5 && <Scene5 frame={frame} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
