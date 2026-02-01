import { Composition } from "remotion";
import { SwimScoreReel } from "./SwimScoreReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SwimScoreReel"
        component={SwimScoreReel}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
