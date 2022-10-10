import React from "react";

type ScaleType = {
  currentPos: number;
  dispatch: any;
};

const initialState: ScaleType = {
  currentPos: 0,
  dispatch: () => undefined,
};
const context = React.createContext(initialState);

const GlobalContext: React.FC<{ children: any }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <context.Provider value={{ ...state, dispatch }}>
      {children}
    </context.Provider>
  );
};

const reducer = (state: ScaleType, action: { type: any; payload?: any }) => {
  switch (action.type) {
    case "update":
      state.currentPos = action.payload;
      return { ...state };
    default:
      return state;
  }
};

export const useScaleContext = () => {
  const { currentPos, dispatch } = React.useContext(context);

  return { currentPos, dispatch };
};

export default GlobalContext;
