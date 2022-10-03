import React from "react";

const Index: React.FC<{
  selectImage: (
    e: React.MouseEvent<HTMLImageElement> | React.ChangeEvent<HTMLInputElement>
  ) => void;
}> = ({ selectImage }) => {
  const [imgStyle, setImgStyle] = React.useState<string>("");

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

  return (
    <div className="cutoutBox">
      <div className="cutout">
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
        src="adobesample.png"
        alt="people"
      />
    </div>
  );
};

export default Index;
