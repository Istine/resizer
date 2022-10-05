import React from "react";

const Index: React.FC<{
  selectImage: (
    e: React.MouseEvent<HTMLImageElement> | React.ChangeEvent<HTMLInputElement>
  ) => void;
}> = ({ selectImage }) => {
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

  const handleDragOver = (e: Event) => {
    e.preventDefault();
    setDragStyle("drag");
  };

  const handleDragLeave = (e: Event) => {
    e.preventDefault();
    setDragStyle("undrag");
  };

  const handleDrop = (e: Event) => {
    e.preventDefault();
    console.log();

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
    <div className="cutoutBox">
      <div ref={dragRef} className={`cutout ${dragStyle}`}>
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
