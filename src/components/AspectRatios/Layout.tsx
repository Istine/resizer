import React from "react";
import AspectRatio from "./Ratio";
import { MAPS } from "../../constants";
import { useSelectContext } from "../../context/SelectContext";

const Index: React.FC<{}> = () => {
  const { currentItem, currentAspectRatio, dispatch } = useSelectContext();
  const value = currentItem.toString().toLowerCase();
  const kv = MAPS[value];

  const keys = Object.keys(kv);

  const Ratios = keys.map((key, idx) => {
    return (
      <AspectRatio
        key={idx}
        aspectRatio={kv[key]}
        currentAspectRatio={currentAspectRatio}
        dispatch={dispatch}
      />
    );
  });

  return <div className="aspect-ratio-container">{Ratios}</div>;
};

export default Index;
