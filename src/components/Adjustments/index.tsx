import React from "react";
import { useSelectContext } from "../../context/SelectContext";
import Select from "../Select";
import { Check } from "@mui/icons-material";

const SOCIALS = [
  "facebook",
  "instagram",
  "twitter",
  "pinterest",
  "youtube",
  "linkedin",
  "snapchat",
  "standard",
  "custom",
];

const Index: React.FC<{}> = () => {
  const { dispatch, currentItem, open } = useSelectContext();

  const listRef = React.useRef<HTMLUListElement>(null);

  const handleSelection =
    (data: { type: string; payload: string }) =>
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.stopPropagation();
      dispatch(data);
      dispatch({ type: "close" });
    };

  const openMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (open) dispatch({ type: "close" });
    else dispatch({ type: "open" });
  };

  const ListItems = SOCIALS.map((item, idx) => (
    <li onClick={handleSelection({ type: "select", payload: item })} key={idx}>
      {item}
      {item === currentItem && <Check color="primary" fontSize="small" />}
    </li>
  ));

  const handleOutSideClick = (e: Event) => {
    dispatch({ type: "close" });
    e.stopPropagation();
  };

  const className = open ? "select-open" : "select-close";

  React.useEffect(() => {
    if (open) {
      document.addEventListener("click", handleOutSideClick);
      setTimeout(() => {
        const list = listRef.current as HTMLUListElement;
        list.style.display = "block";
      }, 200);

      return () => {
        document.removeEventListener("click", handleOutSideClick);
      };
    } else {
      setTimeout(() => {
        const list = listRef.current as HTMLUListElement;
        list.style.display = "none";
      }, 200);
    }
  }, [open]);

  return (
    <div className="adjustments">
      <p>Resize For:</p>
      <Select open={open} currentItem={currentItem} openMenu={openMenu} />
      {
        <ul ref={listRef} className={`list ${className}`}>
          {ListItems}
        </ul>
      }
    </div>
  );
};

export default Index;
