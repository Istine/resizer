import React from "react";
import { useScaleContext } from "../../context/ScaleContext";

const Canvas: React.FC<{
  image: string | ArrayBuffer | any;
  positions: { x: number; y: number };
  hold: boolean;
  currentAspectRatio: number;
}> = ({ image, positions, hold, currentAspectRatio }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { currentPos } = useScaleContext();

  const [prevPoint, setPrevPoint] = React.useState({ x: 0, y: 0 });

  const [diff, setDiff] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as any;
    const img = new Image();

    img.src = image;
    img.loading = "lazy";

    const flagX = (img.naturalWidth - canvas.width) * (currentPos + 1);
    const posX =
      positions.x === 0
        ? prevPoint.x
        : positions.x - canvas.offsetLeft - flagX / 2;

    const differenceX = posX - prevPoint.x;
    const diffStatusX = Math.abs(differenceX - diff.x) > 20; // was previously 50

    const diffValueX = diffStatusX ? differenceX : diff.x;

    const cordX = posX - diffValueX;

    const updateXCords =
      (cordX < 0 && cordX >= -flagX) || (cordX <= 0 && cordX > -1);

    if (updateXCords) {
      img.onload = (e: Event) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, cordX, prevPoint.y);
        setPrevPoint((prevPoints) => ({ ...prevPoints, x: cordX }));
      };
    }
    if (diffStatusX)
      setDiff((prevDifference) => ({ ...prevDifference, x: differenceX }));
  }, [positions.x]);

  React.useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as any;
    const img = new Image();

    img.src = image;
    img.loading = "lazy";

    const flagH = (img.naturalHeight - canvas.height) * (currentPos + 1);

    const posY =
      positions.y === 0
        ? prevPoint.y
        : positions.y - canvas.offsetTop - flagH / 2;

    const differenceY = posY - prevPoint.y;
    const diffStatusY = Math.abs(differenceY - diff.y) > 50;

    if (diffStatusY)
      setDiff((prevDifference) => ({ ...prevDifference, y: differenceY }));

    const diffValueY = diffStatusY ? differenceY : diff.y;

    const cordY = posY - diffValueY;

    const updateYCords =
      (cordY < 0 && cordY >= -flagH) || (cordY <= 0 && cordY > -1);

    if (updateYCords) {
      setPrevPoint((prevPoints) => ({ ...prevPoints, y: cordY }));
      img.onload = (e: Event) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, prevPoint.x, cordY);
      };
    }
  }, [positions.y]);

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

      let outputWidth = inputWidth;
      let outputHeight = inputHeight;

      if (inputImageAspectRatio > outputImageAspectRatio) {
        outputWidth = inputHeight * outputImageAspectRatio;
      } else if (inputImageAspectRatio < outputImageAspectRatio) {
        outputHeight = inputWidth / outputImageAspectRatio;
      }

      const scale = currentPos + 1;

      const outputX = (outputWidth - inputWidth) * 0.5 * scale;
      const outputY = (outputHeight - inputHeight) * 0.5 * scale;
      setPrevPoint((prevState) => ({ ...prevState, x: outputX, y: outputY }));

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.scale(scale, scale);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, outputX, outputY);
    };
    img.src = image;
  }, [image, currentPos, currentAspectRatio]);

  return (
    <div className="canvas-cover">
      <canvas
        id="main-canvas"
        ref={canvasRef}
        style={{ cursor: hold ? "grabbing" : "grab" }}
      />
    </div>
  );
};

export default Canvas;
