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
const BAR_CHART_WIDTH = 320;
const BAR_CHART_HEIGHT = 40;
const LINE_CHART_WIDTH = 300;
const LINE_CHART_HEIGHT = 160;

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
  metricLabel: {
    fontSize: 34,
    fontWeight: 600,
    color: "#ffffff",
    textAlign: "center" as const,
    margin: 0,
  },
  measureText: {
    fontSize: 30,
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center" as const,
    margin: 0,
  },
  ctaText: {
    fontSize: 32,
    fontWeight: 500,
    color: "#ffffff",
    textAlign: "center" as const,
    lineHeight: 1.5,
    margin: 0,
    maxWidth: 600,
  },
  ctaSecondary: {
    fontSize: 28,
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center" as const,
    margin: 0,
  },
};

// Scene 1: What Men Already Track
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const lineDelay = 12; // Slower - more time between lines
  const animDuration = 18; // Slower fade in

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
  const fadeDuration = 22; // Slower fade out

  // Metrics fade away completely
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

  // "One health metric is missing" text animation - slower
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
      {/* Metrics fading away */}
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

      {/* "One health metric is missing" text */}
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

// Scene 3: Horizontal Bar Chart → Line Chart Transition
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  // Phase 1: Fade out previous text
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

  // Horizontal bar fill animation (smooth)
  const barStart = SCENE_3_START + 12;
  const barDuration = 40; // Slower fill
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

  // "Male Fertility Health Metric" text - slower
  const labelStart = barStart + 25;
  const labelOpacity = interpolate(
    frame,
    [labelStart, labelStart + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Phase 2: Bar fades out completely, then line chart comes in
  const barFadeStart = SCENE_3_START + 58;
  const barOpacity = interpolate(
    frame,
    [barFadeStart, barFadeStart + 12],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Line chart appears after bar is gone
  const lineChartStart = barFadeStart + 15;
  const lineChartOpacity = interpolate(
    frame,
    [lineChartStart, lineChartStart + 12],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Line drawing animation
  const lineDrawStart = lineChartStart + 5;
  const lineDrawDuration = 30; // Slower line draw
  const lineProgress = interpolate(
    frame,
    [lineDrawStart, lineDrawStart + lineDrawDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  // "Measure and improve" text - slower
  const measureStart = lineDrawStart + 25;
  const measureOpacity = interpolate(
    frame,
    [measureStart, measureStart + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const measureTranslateY = interpolate(
    frame,
    [measureStart, measureStart + 20],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Line chart path (upward trend)
  const linePoints = [
    { x: 0, y: 130 },
    { x: 75, y: 110 },
    { x: 150, y: 80 },
    { x: 225, y: 45 },
    { x: 300, y: 25 },
  ];

  const linePath = linePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const lineLength = 380;
  const lineDashOffset = lineLength * (1 - lineProgress);

  // Determine what to show
  const showBar = frame < barFadeStart + 12;
  const showLineChart = frame >= lineChartStart;

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

      {/* Main content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        {/* Horizontal Bar Chart */}
        {showBar && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              opacity: barOpacity,
            }}
          >
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
                rx={6}
              />
              {/* Filled bar (left to right) */}
              <rect
                x={0}
                y={0}
                width={(BAR_CHART_WIDTH * barFillPercent) / 100}
                height={BAR_CHART_HEIGHT}
                fill="rgba(255, 255, 255, 0.9)"
                rx={6}
              />
              {/* Percentage text */}
              {barFillPercent > 15 && (
                <text
                  x={(BAR_CHART_WIDTH * barFillPercent) / 100 - 35}
                  y={BAR_CHART_HEIGHT / 2 + 6}
                  textAnchor="middle"
                  fill="#0d0d1a"
                  fontSize={18}
                  fontWeight={600}
                >
                  {Math.round(barFillPercent)}%
                </text>
              )}
            </svg>

            {/* "Male Fertility Health Metric" label */}
            <p
              style={{
                ...styles.metricLabel,
                opacity: labelOpacity,
              }}
            >
              Male Fertility Health Metric
            </p>
          </div>
        )}

        {/* Line Chart */}
        {showLineChart && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              opacity: lineChartOpacity,
            }}
          >
            <svg width={LINE_CHART_WIDTH} height={LINE_CHART_HEIGHT}>
              {/* Grid lines */}
              <line
                x1={0}
                y1={LINE_CHART_HEIGHT}
                x2={LINE_CHART_WIDTH}
                y2={LINE_CHART_HEIGHT}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
              />
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={LINE_CHART_HEIGHT}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
              />
              {/* Horizontal grid lines */}
              {[0.25, 0.5, 0.75].map((ratio) => (
                <line
                  key={ratio}
                  x1={0}
                  y1={LINE_CHART_HEIGHT * ratio}
                  x2={LINE_CHART_WIDTH}
                  y2={LINE_CHART_HEIGHT * ratio}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth={1}
                />
              ))}
              {/* Trend line */}
              <path
                d={linePath}
                fill="none"
                stroke="#ffffff"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineLength}
                strokeDashoffset={lineDashOffset}
              />
              {/* End point dot */}
              {lineProgress > 0.85 && (
                <circle
                  cx={300}
                  cy={25}
                  r={6}
                  fill="#ffffff"
                  opacity={interpolate(
                    frame,
                    [
                      lineDrawStart + lineDrawDuration * 0.85,
                      lineDrawStart + lineDrawDuration,
                    ],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  )}
                />
              )}
            </svg>

            {/* "Measure and improve" text */}
            <p
              style={{
                ...styles.measureText,
                opacity: measureOpacity,
                transform: `translateY(${measureTranslateY}px)`,
              }}
            >
              Measure and improve
            </p>
          </div>
        )}
      </div>
    </>
  );
};

// Scene 4: CTA
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  // Line chart persists (faded)
  const lineChartOpacity = interpolate(
    frame,
    [SCENE_4_START, SCENE_4_START + 15],
    [1, 0.25],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Main CTA text - slower
  const ctaStart = SCENE_4_START + 8;
  const ctaOpacity = interpolate(
    frame,
    [ctaStart, ctaStart + 25],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const ctaTranslateY = interpolate(
    frame,
    [ctaStart, ctaStart + 25],
    [12, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // "Be proactive" secondary text - slower
  const proactiveStart = ctaStart + 28;
  const proactiveOpacity = interpolate(
    frame,
    [proactiveStart, proactiveStart + 20],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Line chart path (same as Scene 3)
  const linePoints = [
    { x: 0, y: 130 },
    { x: 75, y: 110 },
    { x: 150, y: 80 },
    { x: 225, y: 45 },
    { x: 300, y: 25 },
  ];
  const linePath = linePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
        padding: 40,
      }}
    >
      {/* Faded line chart */}
      <svg
        width={LINE_CHART_WIDTH}
        height={LINE_CHART_HEIGHT}
        style={{ opacity: lineChartOpacity }}
      >
        <line
          x1={0}
          y1={LINE_CHART_HEIGHT}
          x2={LINE_CHART_WIDTH}
          y2={LINE_CHART_HEIGHT}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
        />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={LINE_CHART_HEIGHT}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
        />
        <path
          d={linePath}
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={300} cy={25} r={6} fill="#ffffff" />
      </svg>

      {/* CTA text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: ctaOpacity,
          transform: `translateY(${ctaTranslateY}px)`,
        }}
      >
        <p style={styles.ctaText}>
          Know where you stand on{"\n"}the ultimate health metric.
        </p>
      </div>

      {/* "Be proactive" */}
      <p
        style={{
          ...styles.ctaSecondary,
          opacity: proactiveOpacity,
        }}
      >
        Be proactive.
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
