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

  const selectImage = async (
    e: React.MouseEvent<HTMLImageElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.type === "click") {
      const img = await changeImageDimensions(SAMPLE_IMAGE);
      setImage(img);
    } else {
      const { files } = e.target as HTMLInputElement;
      const reader = new FileReader();
      if (files?.length) {
        reader.readAsDataURL(files[0]);
        reader.onloadend = async (e: Event) => {
          const img = await changeImageDimensions(reader.result as string);
          setImage(img);
        };
      }
    }
  };

  const setDraggedImage = async (image: string) => {
    const img = await changeImageDimensions(image);
    setImage(img);
  };

  const changeImageDimensions = (image: string) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const img = new Image();

      const MAX_WIDTH = 1080;
      const MAX_HEIGHT = 1080;

      img.onload = (e: Event) => {
        const inputWidth = img.naturalWidth;
        const inputHeight = img.naturalHeight;

        let outputWidth = inputWidth;
        let outputHeight = inputHeight;

        if (outputWidth > outputHeight) {
          if (outputWidth > MAX_WIDTH) {
            outputHeight = Math.round((outputHeight * MAX_WIDTH) / outputWidth);
            outputWidth = MAX_WIDTH;
          }
        } else {
          if (outputHeight > MAX_HEIGHT) {
            outputWidth = Math.round((outputWidth * MAX_HEIGHT) / outputHeight);
            outputHeight = MAX_HEIGHT;
          }
        }

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        context?.drawImage(img, 0, 0, outputWidth, outputHeight);
        canvas.toBlob(
          (blob) => {
            const blobUrl = URL.createObjectURL(blob as Blob);
            resolve(blobUrl);
            // URL.revokeObjectURL(blobUrl);
          },
          "image/jpeg",
          0.9
        );
      };

      img.src = image;
    });
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
      reader.onloadend = async (e: Event) => {
        const img = await changeImageDimensions(reader.result as string);
        setImage(img);
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
