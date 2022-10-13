import React from "react";
import { useScaleContext } from "../../context/ScaleContext";

const Index: React.FC<{}> = () => {
  const handleRef = React.useRef<HTMLDivElement>(null);
  const slideBar = React.useRef<HTMLDivElement>(null);

  const [currentPos, setCurrentPos] = React.useState(0);

  const { dispatch } = useScaleContext();

  const [hold, setHold] = React.useState(false);

  const mouseMove = (e: any) => {
    if (hold) {
      const bar = slideBar.current as HTMLDivElement;
      const bounds = bar.getBoundingClientRect();
      const offset =
        e.target.className === "handle"
          ? e.currentTarget.offsetLeft
          : e.clientX - bounds.x;
      const posX = Math.floor(offset);
      setCurrentPos(posX);
    }
  };

  const mouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setHold(true);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const posX = Math.floor(e.clientX - bounds.x);
    setCurrentPos(posX);
  };

  const handleMove = (e: any) => {
    const bar = slideBar.current as HTMLDivElement;

    const offset =
      e.target.className === "handle handle-is-active" ? e.layerX : e.offsetX;
    if (offset <= bar.clientWidth && hold) setCurrentPos(offset);
  };

  const handleMouseUp = (e: any) => {
    setHold(false);
  };

  React.useEffect(() => {
    const grid = document.querySelector(".right-grid") as HTMLDivElement;
    grid.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      grid.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hold]);

  React.useEffect(() => {
    const ball = handleRef.current as HTMLDivElement;
    const bar = slideBar.current as HTMLDivElement;
    ball.style.transform = `translateX(${currentPos}px)`;
    const width = bar.clientWidth;

    dispatch({
      type: "update",
      payload: currentPos / width,
    });
  }, [currentPos]);

  return (
    <div className="scale" aria-label="slider">
      <span>Image Scale</span>
      <div className="slide-bar-container">
        <div
          onMouseMove={mouseMove}
          onClick={onClick}
          className="bar"
          ref={slideBar}
        ></div>
        <div
          onMouseDown={mouseDown}
          ref={handleRef}
          className={`handle ${hold ? "handle-is-active" : ""}`}
        ></div>
      </div>
    </div>
  );
};

export default Index;
