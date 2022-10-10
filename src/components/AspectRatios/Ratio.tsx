import React from "react";

const Ratio: React.FC<{
  aspectRatio: Array<number>;
  currentAspectRatio: number;
  dispatch: any;
}> = ({ aspectRatio, currentAspectRatio, dispatch }) => {
  const inputAspectRatio = 60 / 60;

  const outputputAspectRatio = aspectRatio[0] / aspectRatio[1];

  let outputWidth = 60;
  let outputHeight = 60;

  if (inputAspectRatio > outputputAspectRatio) {
    outputWidth = 60 * outputputAspectRatio;
  } else if (inputAspectRatio < outputputAspectRatio) {
    outputHeight = 60 / outputputAspectRatio;
  }

  const styles = {
    width: outputWidth,
    height: outputHeight,
  };

  const aspectBoxStyles = {
    border: currentAspectRatio === outputputAspectRatio ? "2px solid #000" : "",
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    dispatch({
      type: "change-aspect-ratio",
      payload: outputputAspectRatio,
    });
  };

  return (
    <div style={aspectBoxStyles} onClick={onClick} className="aspect-ratio-box">
      <div style={styles} className="aspect-ratio">
        <span>
          {aspectRatio[0]} : {aspectRatio[1]}
        </span>
      </div>
    </div>
  );
};

export default Ratio;
