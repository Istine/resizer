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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setHold(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setHold(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hold) {
      setPositions((prevState) => ({
        ...prevState,
        x: e.clientX,
        y: e.clientX,
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

  return (
    <Layout>
      <div className="grid">
        <main
          className={`canvas ${hold ? "click-hold" : ""}`}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {image ? (
            <Canvas
              currentAspectRatio={currentAspectRatio}
              hold={hold}
              positions={positions}
              image={image}
              handleMouseDown={handleMouseDown}
            />
          ) : (
            <CanvasPlaceHolder
              setDraggedImage={setDraggedImage}
              selectImage={selectImage}
            />
          )}
        </main>
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
