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
const SCENE_4_START = 195;
const SCENE_4_END = 270;

// Metrics text for Scene 1
const metrics = ["Sleep", "Recovery", "Heart Rate", "VO₂ Max"];

// Chart dimensions
const BAR_CHART_WIDTH = 400;
const BAR_CHART_HEIGHT = 50;

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
    gap: 32,
  },
  metricText: {
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: 1,
    margin: 0,
    color: "rgba(255, 255, 255, 0.7)",
  },
  metricTextLast: {
    fontSize: 48,
    fontWeight: 500,
    letterSpacing: 1,
    margin: 0,
    color: "rgba(255, 255, 255, 0.88)",
  },
  missingText: {
    fontSize: 40,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: "#ffffff",
    textAlign: "center" as const,
    lineHeight: 1.4,
  },
  swimScoreTitle: {
    fontSize: 72,
    fontWeight: 800,
    color: "#ffffff",
    textAlign: "center" as const,
    margin: 0,
    letterSpacing: 2,
  },
  metricLabel: {
    fontSize: 36,
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center" as const,
    margin: 0,
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 600,
    color: "#0d0d1a",
    margin: 0,
  },
  bigText: {
    fontSize: 56,
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center" as const,
    margin: 0,
    letterSpacing: 1,
  },
};

// Scene 1: What Men Already Track
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const lineDelay = 12;
  const animDuration = 18;

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

// Scene 2: One Health Metric Is Missing
const Scene2: React.FC<{ frame: number }> = ({ frame }) => {
  const fadeStart = SCENE_2_START;
  const fadeDuration = 22;

  const metricsOpacity = interpolate(
    frame,
    [fadeStart, fadeStart + fadeDuration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const textStart = fadeStart + 18;
  const missingOpacity = interpolate(
    frame,
    [textStart, textStart + 22],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const missingTranslateY = interpolate(
    frame,
    [textStart, textStart + 22],
    [12, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <>
      <div
        style={{
          ...styles.metricsContainer,
          opacity: metricsOpacity,
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: missingOpacity,
          transform: `translateY(${missingTranslateY}px)`,
          padding: 40,
        }}
      >
        <p style={styles.missingText}>One health metric{"\n"}is missing</p>
      </div>
    </>
  );
};

// Scene 3: SwimScore with Bar Chart
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  // Fade out previous text
  const fadeOutStart = SCENE_3_START;
  const fadeOutOpacity = interpolate(
    frame,
    [fadeOutStart, fadeOutStart + 15],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // SwimScore title appears
  const titleStart = SCENE_3_START + 10;
  const titleOpacity = interpolate(
    frame,
    [titleStart, titleStart + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const titleTranslateY = interpolate(
    frame,
    [titleStart, titleStart + 20],
    [15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Bar fill animation
  const barStart = SCENE_3_START + 25;
  const barDuration = 45;
  const barFillPercent = interpolate(
    frame,
    [barStart, barStart + barDuration],
    [0, 75],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // Score display (animated number)
  const displayScore = Math.round(barFillPercent);

  // "The Male Fertility Health Metric" text
  const labelStart = barStart + 30;
  const labelOpacity = interpolate(
    frame,
    [labelStart, labelStart + 22],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const labelTranslateY = interpolate(
    frame,
    [labelStart, labelStart + 22],
    [10, 0],
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
          alignItems: "center",
          justifyContent: "center",
          opacity: fadeOutOpacity,
          padding: 40,
        }}
      >
        <p style={styles.missingText}>One health metric{"\n"}is missing</p>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {/* SwimScore title */}
        <p
          style={{
            ...styles.swimScoreTitle,
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}
        >
          SwimScore
        </p>

        {/* Horizontal Bar Chart */}
        <svg width={BAR_CHART_WIDTH} height={BAR_CHART_HEIGHT}>
          {/* Background bar (outline) */}
          <rect
            x={0}
            y={0}
            width={BAR_CHART_WIDTH}
            height={BAR_CHART_HEIGHT}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth={2}
            rx={8}
          />
          {/* Filled bar */}
          <rect
            x={0}
            y={0}
            width={(BAR_CHART_WIDTH * barFillPercent) / 100}
            height={BAR_CHART_HEIGHT}
            fill="rgba(255, 255, 255, 0.9)"
            rx={8}
          />
          {/* Score text inside bar */}
          {displayScore > 20 && (
            <text
              x={(BAR_CHART_WIDTH * barFillPercent) / 100 - 50}
              y={BAR_CHART_HEIGHT / 2 + 8}
              textAnchor="middle"
              fill="#0d0d1a"
              fontSize={22}
              fontWeight={700}
            >
              {displayScore} / 100
            </text>
          )}
        </svg>

        {/* "The Male Fertility Health Metric" label */}
        <p
          style={{
            ...styles.metricLabel,
            opacity: labelOpacity,
            transform: `translateY(${labelTranslateY}px)`,
          }}
        >
          The Male Fertility Health Metric
        </p>
      </div>
    </>
  );
};

// Scene 4: CTA Text Sequence
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  // Fade out previous scene
  const fadeOutOpacity = interpolate(
    frame,
    [SCENE_4_START, SCENE_4_START + 18],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // "Be proactive" text
  const text1Start = SCENE_4_START + 12;
  const text1Opacity = interpolate(
    frame,
    [text1Start, text1Start + 22],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const text1TranslateY = interpolate(
    frame,
    [text1Start, text1Start + 22],
    [15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // "Know where you stand" text
  const text2Start = text1Start + 28;
  const text2Opacity = interpolate(
    frame,
    [text2Start, text2Start + 22],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const text2TranslateY = interpolate(
    frame,
    [text2Start, text2Start + 22],
    [15, 0],
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
          gap: 40,
          opacity: fadeOutOpacity,
        }}
      >
        <p style={styles.swimScoreTitle}>SwimScore</p>
        <svg width={BAR_CHART_WIDTH} height={BAR_CHART_HEIGHT}>
          <rect
            x={0}
            y={0}
            width={BAR_CHART_WIDTH}
            height={BAR_CHART_HEIGHT}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth={2}
            rx={8}
          />
          <rect
            x={0}
            y={0}
            width={(BAR_CHART_WIDTH * 75) / 100}
            height={BAR_CHART_HEIGHT}
            fill="rgba(255, 255, 255, 0.9)"
            rx={8}
          />
          <text
            x={(BAR_CHART_WIDTH * 75) / 100 - 50}
            y={BAR_CHART_HEIGHT / 2 + 8}
            textAnchor="middle"
            fill="#0d0d1a"
            fontSize={22}
            fontWeight={700}
          >
            75 / 100
          </text>
        </svg>
        <p style={styles.metricLabel}>The Male Fertility Health Metric</p>
      </div>

      {/* New text sequence */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
        }}
      >
        {/* "Be proactive" */}
        <p
          style={{
            ...styles.bigText,
            opacity: text1Opacity,
            transform: `translateY(${text1TranslateY}px)`,
          }}
        >
          Be proactive.
        </p>

        {/* "Know where you stand" */}
        <p
          style={{
            ...styles.bigText,
            opacity: text2Opacity,
            transform: `translateY(${text2TranslateY}px)`,
          }}
        >
          Know where you stand.
        </p>
      </div>
    </>
  );
};

// Main SwimScoreReel Component
export const SwimScoreReel: React.FC = () => {
  const frame = useCurrentFrame();

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
