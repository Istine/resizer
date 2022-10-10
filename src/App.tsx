import Canvas from "./components/Canvas";
import SelectContext from "./context/SelectContext";
import ScaleContext from "./context/ScaleContext";

function App() {
  return (
    <SelectContext>
      <ScaleContext>
        <Canvas />
      </ScaleContext>
    </SelectContext>
  );
}

export default App;
