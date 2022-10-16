import React from "react";
import Layout from "../Layout";
import { ICanvas } from "./types";
import CanvasPlaceHolder from "../UploadImageHolder/index";
import Canvas from "./Canvas";
import Adjustments from "../Adjustments";
import { useSelectContext } from "../../context/SelectContext";

export type ImageType = string | ArrayBuffer | any;

const Index: React.FC<ICanvas> = () => {
  const [image, setImage] = React.useState<ImageType>("");

  const { currentAspectRatio } = useSelectContext();

  const [hold, setHold] = React.useState(false);

  const [positions, setPositions] = React.useState({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (e: any) => {
    if (e.target?.id === "main-canvas") setHold(true);
  };

  const handleMouseUp = (e: Event) => {
    setHold(false);
  };

  const handleMouseMove = (e: any) => {
    if (hold) {
      setPositions((prevState) => ({
        ...prevState,
        x: e.offsetX,
        y: e.offsetY,
      }));
    }
  };

  const selectImage = (
    e: React.MouseEvent<HTMLImageElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.type === "click") {
      setImage("adobesample.png");
    } else {
      const { files } = e.target as HTMLInputElement;
      const reader = new FileReader();
      if (files?.length) {
        reader.readAsDataURL(files[0]);
        reader.onloadend = (e: Event) => {
          setImage(reader.result);
        };
      }
    }
  };

  const setDraggedImage = (image: string) => {
    setImage(image);
  };

  React.useEffect(() => {
    const grid = document.getElementById("left-grid") as HTMLDivElement;
    grid.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      grid.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [hold]);

  return (
    <Layout>
      <div className="grid">
        <div
          id="left-grid"
          className={`canvas ${hold ? "click-hold" : ""}`}
          // onMouseUp={handleMouseUp}
          // onMouseMove={handleMouseMove}
        >
          {image ? (
            <Canvas
              currentAspectRatio={currentAspectRatio}
              hold={hold}
              positions={positions}
              image={image}
              // handleMouseDown={handleMouseDown}
            />
          ) : (
            <CanvasPlaceHolder
              setDraggedImage={setDraggedImage}
              selectImage={selectImage}
            />
          )}
        </div>
        <div className="right-grid">
          <h1>Resize image</h1>
          <p>
            Powered by <span>Adobe</span>
          </p>
          <p>Change the dimensions of any photo.</p>
          <Adjustments />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
