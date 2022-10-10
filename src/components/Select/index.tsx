import React from "react";
import { ExpandMoreRounded, ExpandLessRounded } from "@mui/icons-material";

const Index: React.FC<{
  currentItem: string;
  openMenu: (e: React.MouseEvent<HTMLDivElement>) => void;
  open: boolean;
}> = ({ currentItem, openMenu, open }) => {
  const activeCssMenu = open ? "active-select-menu" : "";
  return (
    <div
      aria-label="select"
      className={`select ${activeCssMenu}`}
      onClick={openMenu}
    >
      {currentItem}
      <ExpandMoreRounded />
    </div>
  );
};

export default Index;
