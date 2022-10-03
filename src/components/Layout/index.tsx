import React from "react";
import { ILayout } from "./types";

const Index: React.FC<ILayout> = ({ children, mode }) => {
  return (
    <>
      <div className="layout"></div>
      {children}
    </>
  );
};

export default Index;
