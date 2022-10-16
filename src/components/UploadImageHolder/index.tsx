import React from "react";
import { ImageType } from "../Canvas";

const Index: React.FC<{
  selectImage: (
    e: React.MouseEvent<HTMLImageElement> | React.ChangeEvent<HTMLInputElement>
  ) => void;
  setDraggedImage: (image: ImageType) => void;
}> = ({ selectImage, setDraggedImage }) => {
  const [imgStyle, setImgStyle] = React.useState<string>("");

  const dragRef = React.useRef<HTMLDivElement>(null);

  const [dragStyle, setDragStyle] = React.useState("");

  const fileRef = React.useRef<HTMLInputElement>(null);

  const openSystemFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    fileRef.current?.click();
  };

  const onMouseOver = (e: React.MouseEvent<HTMLImageElement>) => {
    setImgStyle("fade-in");
  };

  const onMouseOut = (e: React.MouseEvent<HTMLImageElement>) => {
    setImgStyle("fade-out");
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragStyle("drag");
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setDragStyle("undrag");
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const reader = new FileReader();
    if (e.dataTransfer?.files.length) {
      reader.readAsDataURL(e.dataTransfer?.files[0]);
      reader.onloadend = (e) => {
        setDraggedImage(reader.result);
      };
    }

    setDragStyle("undrag");
  };

  React.useEffect(() => {
    dragRef.current?.addEventListener("dragover", handleDragOver);
    dragRef.current?.addEventListener("drop", handleDrop);
    dragRef.current?.addEventListener("dragleave", handleDragLeave);

    return () => {
      dragRef.current?.removeEventListener("dragover", handleDragOver);
      dragRef.current?.removeEventListener("drop", handleDrop);
      dragRef.current?.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return (
    <div ref={dragRef} className="cutoutBox">
      <div className={`cutout ${dragStyle}`}>
        <span></span>
        <h3>Drag & drop an image</h3>
        <input
          onChange={selectImage}
          ref={fileRef}
          type="file"
          id="file-upload"
          className="file-upload"
        />
        <button onClick={openSystemFile}>Browse on your device</button>
      </div>
      <p>Or select sample page:</p>
      <img
        onClick={selectImage}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseOut}
        className={imgStyle}
        role="button"
        src="adobesample.png"
        alt="people"
      />
    </div>
  );
};

export default Index;
