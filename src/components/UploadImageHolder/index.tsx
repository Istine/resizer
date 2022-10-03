import React from "react";

const Index: React.FC<{
  selectImage: (
    selectedImage: string
  ) => (e: React.MouseEvent<HTMLImageElement | HTMLButtonElement>) => void;
}> = ({ selectImage }) => {
  const [imgStyle, setImgStyle] = React.useState<string>("");

  const fileRef = React.useRef<HTMLInputElement>(null);

  const openSystemFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    fileRef.current?.click();
  };

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const filePath = files?.length && files[0];
    const url = URL.createObjectURL(filePath as any);
    selectImage(url);
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
          onInput={loadFile}
          ref={fileRef}
          type="file"
          id="file"
          className="file-upload"
        />
        <button onClick={openSystemFile}>Browse on your device</button>
      </div>
      <p>Or select sample page:</p>
      <img
        onClick={selectImage("/public/people.jpg")}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseOut}
        className={imgStyle}
        src="people.jpg"
        alt="people"
      />
    </div>
  );
};

export default Index;
