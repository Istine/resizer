import React from "react";
import Layout from "../Layout";
import { ICanvas } from "./types";
import CanvasPlaceHolder from "../UploadImageHolder/index";
import Canvas from "./Canvas";
import Adjustments from "../Adjustments";
import { useSelectContext } from "../../context/SelectContext";
import { v4 } from "uuid";

export const SAMPLE_IMAGE = "adobesample.png";

export type ImageType = string | ArrayBuffer | any;

const Index: React.FC<ICanvas> = () => {
  const [image, setImage] = React.useState<ImageType>("");

  const fileReference = React.useRef<HTMLInputElement>(null);

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
      setImage(SAMPLE_IMAGE);
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

  const downloadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const targetCanvas = document.createElement("canvas") as HTMLCanvasElement;
    let w = 692;
    let h = 620;
    const ratio = w / h;

    if (ratio > currentAspectRatio) {
      w = h * currentAspectRatio;
    } else if (ratio < currentAspectRatio) {
      h = w / currentAspectRatio;
    }

    targetCanvas.width = w;
    targetCanvas.height = h;
    targetCanvas.getContext("2d")?.drawImage(canvas, 0, 0, w, h);
    targetCanvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob as Blob);
        const link = document.createElement("a") as HTMLAnchorElement;
        link.href = url;
        link.download = v4() + ".jpg";
        link.click();

        URL.revokeObjectURL(link.href);
      },
      "image/jpeg",
      0.9
    );
  };

  const uploadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    fileReference?.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target as HTMLInputElement;
    const reader = new FileReader();
    if (files?.length) {
      reader.readAsDataURL(files[0]);
      reader.onloadend = (e: Event) => {
        setImage(reader.result);
      };
    }
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
        <div id="left-grid" className={`canvas ${hold ? "click-hold" : ""}`}>
          {image ? (
            <Canvas
              currentAspectRatio={currentAspectRatio}
              hold={hold}
              positions={positions}
              image={image}
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
          {image === SAMPLE_IMAGE ? (
            <>
              <input
                ref={fileReference}
                type="file"
                id="file-upload"
                className="file-upload"
                onChange={handleImageUpload}
              />
              <button onClick={uploadImage} className="download">
                Upload Image
              </button>
            </>
          ) : (
            image && (
              <button className="download" onClick={downloadImage}>
                Download
              </button>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
