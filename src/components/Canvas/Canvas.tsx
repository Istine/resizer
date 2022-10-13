import React from "react";
import { useScaleContext } from "../../context/ScaleContext";

const Canvas: React.FC<{
  image: string | ArrayBuffer | any;
  positions: { x: number; y: number };
  hold: boolean;
  currentAspectRatio: number;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
}> = ({ image, positions, hold, handleMouseDown, currentAspectRatio }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { currentPos } = useScaleContext();

  React.useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.loading = "lazy";

    const flagValueX = img.naturalWidth - canvas.width;
    const posX = positions.x - canvas.offsetLeft - img.naturalWidth / 2;

    const updateXCords =
      (posX < 0 && posX >= -flagValueX) || (posX <= 0 && posX > -1);

    if (updateXCords) {
      img.onload = (e: Event) => {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, posX, 0);
      };
    }
  }, [positions.y, positions.x]);

  React.useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx: any = canvas?.getContext("2d");
    const img = document.createElement("img");
    img.loading = "lazy";
    const outputImageAspectRatio = currentAspectRatio;

    img.onload = (e: Event) => {
      const inputWidth = img.naturalWidth;
      const inputHeight = img.naturalHeight;

      const inputImageAspectRatio = inputWidth / inputHeight;

      let outputWidth = img.naturalWidth;
      let outputHeight = img.naturalHeight;
      if (inputImageAspectRatio > outputImageAspectRatio) {
        outputWidth = inputHeight * outputImageAspectRatio;
      } else if (inputImageAspectRatio < outputImageAspectRatio) {
        outputHeight = inputWidth / outputImageAspectRatio;
      }

      const scale = currentPos + 1;

      const outputX = (outputWidth - inputWidth) * 0.5 * scale;
      const outputY = (outputHeight - inputHeight) * 0.5 * scale;

      canvas.width = outputWidth;
      canvas.height = outputHeight;
      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, outputX, outputY);
    };
    img.src = image;
  }, [image, currentPos, currentAspectRatio.toString()]);

  return (
    <canvas
      onMouseDown={handleMouseDown}
      ref={canvasRef}
      style={{ cursor: hold ? "grabbing" : "grab" }}
    />
  );
};

export default Canvas;
