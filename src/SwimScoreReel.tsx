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
const SCENE_4_END = 210;

// Metrics text for Scene 1
const metrics = ["Sleep", "Recovery", "Heart Rate", "VO₂ Max"];

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#1a1a2e",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: "#ffffff",
  },
  metricsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  metricText: {
    fontSize: 48,
    fontWeight: 500,
    letterSpacing: 1,
    margin: 0,
  },
  missingText: {
    fontSize: 42,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "#ffffff",
  },
  swimScoreText: {
    fontSize: 52,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#ffffff",
  },
  taglineText: {
    fontSize: 32,
    fontWeight: 400,
    color: "#cccccc",
    textAlign: "center" as const,
    lineHeight: 1.5,
  },
  ctaText: {
    fontSize: 24,
    fontWeight: 500,
    color: "#888888",
    letterSpacing: 1,
  },
};

// Scene 1: What Men Already Track
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const lineDelay = 11; // frames between each line

  return (
    <div style={styles.metricsContainer}>
      {metrics.map((metric, index) => {
        const lineStart = SCENE_1_START + index * lineDelay;

        const opacity = interpolate(frame, [lineStart, lineStart + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.ease),
        });

        const translateY = interpolate(
          frame,
          [lineStart, lineStart + 15],
          [12, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.ease),
          }
        );

        return (
          <p
            key={metric}
            style={{
              ...styles.metricText,
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
  const moveDuration = 22;

  // Metrics group animation
  const groupTranslateY = interpolate(
    frame,
    [moveStart, moveStart + moveDuration],
    [0, -24],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  const groupOpacity = interpolate(
    frame,
    [moveStart, moveStart + moveDuration],
    [1, 0.35],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    }
  );

  // "One thing missing" text animation
  const textStart = moveStart + 10;
  const missingOpacity = interpolate(frame, [textStart, textStart + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  const missingScale = interpolate(
    frame,
    [textStart, textStart + 18],
    [0.98, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
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
        {metrics.map((metric) => (
          <p key={metric} style={styles.metricText}>
            {metric}
          </p>
        ))}
      </div>

      {/* "One thing missing" text */}
      <div
        style={{
          position: "absolute",
          bottom: "38%",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: missingOpacity,
          transform: `scale(${missingScale})`,
        }}
      >
        <p style={styles.missingText}>One thing missing</p>
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
    [fadeOutStart, fadeOutStart + 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  // Ring draw animation
  const ringStart = SCENE_3_START + 10;
  const ringDuration = 38;
  const ringProgress = interpolate(
    frame,
    [ringStart, ringStart + ringDuration],
    [0, 0.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Ring stroke properties
  const ringRadius = 100;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference * (1 - ringProgress);

  // SwimScore text animation
  const textStart = ringStart + ringDuration + 8;
  const swimScoreOpacity = interpolate(
    frame,
    [textStart, textStart + 15],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  const swimScoreTranslateY = interpolate(
    frame,
    [textStart, textStart + 15],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
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
            opacity: 0.35,
            transform: "translateY(-24px)",
          }}
        >
          {metrics.map((metric) => (
            <p key={metric} style={styles.metricText}>
              {metric}
            </p>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "38%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <p style={styles.missingText}>One thing missing</p>
        </div>
      </div>

      {/* Ring and SwimScore */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* Circular ring */}
        <svg
          width={ringRadius * 2 + 20}
          height={ringRadius * 2 + 20}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={ringRadius + 10}
            cy={ringRadius + 10}
            r={ringRadius}
            fill="none"
            stroke="#ffffff"
            strokeWidth={3}
            strokeDasharray={circumference}
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
    [SCENE_4_START, SCENE_4_START + 10],
    [1, 0.8],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Tagline animation
  const taglineStart = SCENE_4_START + 5;
  const taglineOpacity = interpolate(
    frame,
    [taglineStart, taglineStart + 18],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  const taglineTranslateY = interpolate(
    frame,
    [taglineStart, taglineStart + 18],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.ease),
    }
  );

  // CTA animation
  const ctaStart = taglineStart + 20;
  const ctaOpacity = interpolate(frame, [ctaStart, ctaStart + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Ring properties (same as Scene 3 end state)
  const ringRadius = 100;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference * 0.2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      {/* Ring (persistent from Scene 3) */}
      <svg
        width={ringRadius * 2 + 20}
        height={ringRadius * 2 + 20}
        style={{ transform: "rotate(-90deg)", opacity: ringOpacity }}
      >
        <circle
          cx={ringRadius + 10}
          cy={ringRadius + 10}
          r={ringRadius}
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* SwimScore text */}
      <p style={styles.swimScoreText}>SwimScore™</p>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineTranslateY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <p style={styles.taglineText}>Male fertility health</p>
        <p style={styles.taglineText}>Measured</p>
      </div>

      {/* CTA */}
      <p
        style={{
          ...styles.ctaText,
          opacity: ctaOpacity,
          marginTop: 20,
        }}
      >
        Know your number
      </p>
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
  const isScene4 = frame >= SCENE_4_START && frame <= SCENE_4_END;

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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
