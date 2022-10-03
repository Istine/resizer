import React from "react";
import Layout from "../Layout";
import { ICanvas } from "./types";
import CanvasPlaceHolder from "../UploadImageHolder/index";
import Canvas from "./Canvas";

const Index: React.FC<ICanvas> = () => {
  const [image, setImage] = React.useState("");

  const selectImage =
    (selectedImage: string) =>
    (e: React.MouseEvent<HTMLImageElement | HTMLButtonElement>) => {
      setImage(selectedImage);
    };

  return (
    <Layout>
      <div className="grid">
        <div className="canvas">
          {image ? (
            <Canvas image={image} />
          ) : (
            <CanvasPlaceHolder selectImage={selectImage} />
          )}
        </div>
        <div className="right-grid">
          <h1>Resize image</h1>
          <p>
            Powered by <span>Adobe</span>
          </p>
          <p>Change the dimensions of any photo.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
