import React from "react";

const Canvas: React.FC<{
  image: string;
}> = ({ image }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const ctx: any = canvasRef.current?.getContext("2d");
    ctx.fillStyle = "green";
    const img = new Image();
    img.src = image;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }, [image]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
