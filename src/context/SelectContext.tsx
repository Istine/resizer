import React from "react";

type SelectType = {
  open: boolean;
  items: Array<string>;
  currentItem: string;
  currentAspectRatio: number;
  dispatch: any;
};

const initialState: SelectType = {
  open: false,
  items: [],
  currentAspectRatio: 1,
  currentItem: "Standard",
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

const reducer = (state: SelectType, action: { type: any; payload?: any }) => {
  switch (action.type) {
    case "open":
      state.open = true;
      return { ...state };
    case "close":
      state.open = false;
      return { ...state };
    case "select":
      state.currentItem = action.payload;
      return { ...state };
    case "change-aspect-ratio":
      state.currentAspectRatio = action.payload;
      return { ...state };
    default:
      return state;
  }
};

export const useSelectContext = () => {
  const { open, items, currentItem, dispatch, currentAspectRatio } =
    React.useContext(context);

  return { open, currentItem, items, dispatch, currentAspectRatio };
};

export default GlobalContext;
