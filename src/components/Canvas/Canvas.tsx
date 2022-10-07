import React from "react";

const Canvas: React.FC<{
  image: string | ArrayBuffer | any;
  positions: { x: number; y: number };
}> = ({ image, positions }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [temp, setTemp] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.loading = "lazy";

    const flagValueX = img.naturalWidth - canvas.width;

    const posX = positions.x - canvas.offsetLeft - img.naturalWidth * 0.5;

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

      const outputImageAspectRatio = 2 / 3;

      let outputWidth = img.naturalWidth;
      let outputHeight = img.naturalHeight;

      if (inputImageAspectRatio > outputImageAspectRatio) {
        outputWidth = inputHeight * outputImageAspectRatio;
      } else if (inputImageAspectRatio < outputImageAspectRatio) {
        outputHeight = inputWidth / outputImageAspectRatio;
      }

      // calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = (outputHeight - inputHeight) * 0.5;

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, outputX, outputY);
    };
  }, [image]);

  return <canvas ref={canvasRef} />;
};

export default React.memo(Canvas);
