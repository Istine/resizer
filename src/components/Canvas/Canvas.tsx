import React from "react";
import { useScaleContext } from "../../context/ScaleContext";
import { useSelectContext } from "../../context/SelectContext";

const Canvas: React.FC<{
  image: string | ArrayBuffer | any;
  positions: { x: number; y: number };
}> = ({ image, positions }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { currentPos } = useScaleContext();

  const { currentAspectRatio } = useSelectContext();

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
    const img = new Image();
    img.src = image;
    img.loading = "lazy";

    img.onload = (e: Event) => {
      const inputWidth = img.naturalWidth;
      const inputHeight = img.naturalHeight;

      const inputImageAspectRatio = inputWidth / inputHeight;

      const outputImageAspectRatio = currentAspectRatio;

      let outputWidth = img.naturalWidth;
      let outputHeight = img.naturalHeight;
      //2 / 3  3/ 2
      if (inputImageAspectRatio > outputImageAspectRatio) {
        outputWidth = inputHeight * outputImageAspectRatio;
      } else if (inputImageAspectRatio < outputImageAspectRatio) {
        outputHeight = inputWidth / outputImageAspectRatio;
      }

      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = (outputHeight - inputHeight) * 0.5;

      const scale = currentPos;

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, outputX * scale, outputY * scale);
    };
  }, [image, currentPos, currentAspectRatio]);

  return <canvas ref={canvasRef} />;
};

export default React.memo(Canvas);
