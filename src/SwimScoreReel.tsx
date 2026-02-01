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
const SCENE_4_START = 180;
const SCENE_4_END = 270;

// Metrics text for Scene 1
const metrics = ["Sleep", "Recovery", "Heart Rate", "VO₂ Max"];

// Chart dimensions
const CHART_WIDTH = 280;
const CHART_HEIGHT = 180;
const BAR_WIDTH = 60;

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
    lineHeight: 1.3,
  },
  metricLabel: {
    fontSize: 36,
    fontWeight: 600,
    color: "#ffffff",
    textAlign: "center" as const,
    margin: 0,
  },
  measureText: {
    fontSize: 32,
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center" as const,
    margin: 0,
  },
  ctaText: {
    fontSize: 34,
    fontWeight: 500,
    color: "#ffffff",
    textAlign: "center" as const,
    lineHeight: 1.4,
    margin: 0,
    maxWidth: 600,
  },
  ctaSecondary: {
    fontSize: 30,
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center" as const,
    margin: 0,
  },
};

// Scene 1: What Men Already Track
const Scene1: React.FC<{ frame: number }> = ({ frame }) => {
  const lineDelay = 9;
  const animDuration = 12;

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
  const fadeDuration = 18;

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

  // "One health metric is missing" text animation
  const textStart = fadeStart + 14;
  const missingOpacity = interpolate(
    frame,
    [textStart, textStart + 16],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const missingTranslateY = interpolate(
    frame,
    [textStart, textStart + 16],
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

// Scene 3: Bar Chart → Line Chart Transition
const Scene3: React.FC<{ frame: number }> = ({ frame }) => {
  // Phase 1: Fade out previous, bar chart appears and fills
  const fadeOutStart = SCENE_3_START;
  const fadeOutOpacity = interpolate(
    frame,
    [fadeOutStart, fadeOutStart + 10],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Bar fill animation (smooth, no overshoot)
  const barStart = SCENE_3_START + 8;
  const barDuration = 30;
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

  // "Male Fertility Health Metric" text
  const labelStart = barStart + 15;
  const labelOpacity = interpolate(
    frame,
    [labelStart, labelStart + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Phase 2: Bar transforms to line chart
  const transitionStart = SCENE_3_START + 45;
  const transitionDuration = 20;

  // Bar fades out
  const barOpacity = interpolate(
    frame,
    [transitionStart, transitionStart + transitionDuration / 2],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    }
  );

  // Line chart fades in
  const lineChartOpacity = interpolate(
    frame,
    [transitionStart + 8, transitionStart + transitionDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Line drawing animation
  const lineDrawStart = transitionStart + 12;
  const lineDrawDuration = 25;
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

  // "Measure and improve" text
  const measureStart = transitionStart + 20;
  const measureOpacity = interpolate(
    frame,
    [measureStart, measureStart + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const measureTranslateY = interpolate(
    frame,
    [measureStart, measureStart + 14],
    [8, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Line chart path (upward trend)
  const linePoints = [
    { x: 0, y: 140 },
    { x: 70, y: 120 },
    { x: 140, y: 90 },
    { x: 210, y: 50 },
    { x: 280, y: 30 },
  ];

  const linePath = linePoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const lineLength = 350; // Approximate path length
  const lineDashOffset = lineLength * (1 - lineProgress);

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

      {/* Main chart container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {/* Chart area */}
        <div
          style={{
            width: CHART_WIDTH,
            height: CHART_HEIGHT,
            position: "relative",
          }}
        >
          {/* Bar chart */}
          <svg
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: barOpacity,
            }}
          >
            {/* Background bar (outline) */}
            <rect
              x={(CHART_WIDTH - BAR_WIDTH) / 2}
              y={0}
              width={BAR_WIDTH}
              height={CHART_HEIGHT}
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={2}
              rx={4}
            />
            {/* Filled bar */}
            <rect
              x={(CHART_WIDTH - BAR_WIDTH) / 2}
              y={CHART_HEIGHT - (CHART_HEIGHT * barFillPercent) / 100}
              width={BAR_WIDTH}
              height={(CHART_HEIGHT * barFillPercent) / 100}
              fill="rgba(255, 255, 255, 0.9)"
              rx={4}
            />
            {/* Percentage text */}
            {barFillPercent > 10 && (
              <text
                x={CHART_WIDTH / 2}
                y={CHART_HEIGHT - (CHART_HEIGHT * barFillPercent) / 100 + 30}
                textAnchor="middle"
                fill="#0d0d1a"
                fontSize={20}
                fontWeight={600}
              >
                {Math.round(barFillPercent)}%
              </text>
            )}
          </svg>

          {/* Line chart */}
          <svg
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: lineChartOpacity,
            }}
          >
            {/* Grid lines */}
            <line
              x1={0}
              y1={CHART_HEIGHT}
              x2={CHART_WIDTH}
              y2={CHART_HEIGHT}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={CHART_HEIGHT}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth={1}
            />
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
            {lineProgress > 0.9 && (
              <circle
                cx={280}
                cy={30}
                r={6}
                fill="#ffffff"
                opacity={interpolate(
                  frame,
                  [lineDrawStart + lineDrawDuration - 3, lineDrawStart + lineDrawDuration],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )}
              />
            )}
          </svg>
        </div>

        {/* "Male Fertility Health Metric" label */}
        <p
          style={{
            ...styles.metricLabel,
            opacity: labelOpacity,
          }}
        >
          Male Fertility Health Metric
        </p>

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
    </>
  );
};

// Scene 4: CTA
const Scene4: React.FC<{ frame: number }> = ({ frame }) => {
  // Line chart persists (faded)
  const lineChartOpacity = interpolate(
    frame,
    [SCENE_4_START, SCENE_4_START + 10],
    [1, 0.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Main CTA text
  const ctaStart = SCENE_4_START + 5;
  const ctaOpacity = interpolate(
    frame,
    [ctaStart, ctaStart + 18],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const ctaTranslateY = interpolate(
    frame,
    [ctaStart, ctaStart + 18],
    [10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // "Be proactive" secondary text
  const proactiveStart = ctaStart + 18;
  const proactiveOpacity = interpolate(
    frame,
    [proactiveStart, proactiveStart + 14],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Line chart path (same as Scene 3)
  const linePoints = [
    { x: 0, y: 140 },
    { x: 70, y: 120 },
    { x: 140, y: 90 },
    { x: 210, y: 50 },
    { x: 280, y: 30 },
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
        gap: 40,
        padding: 40,
      }}
    >
      {/* Faded line chart */}
      <svg
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        style={{ opacity: lineChartOpacity }}
      >
        <line
          x1={0}
          y1={CHART_HEIGHT}
          x2={CHART_WIDTH}
          y2={CHART_HEIGHT}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={1}
        />
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={CHART_HEIGHT}
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
        <circle cx={280} cy={30} r={6} fill="#ffffff" />
      </svg>

      {/* CTA text */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
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
