import ListGroup from "./ListGroup";
import Navbar from "./Navbar";
import "./App.css";

function onSelectItem(event: React.BaseSyntheticEvent) {
  console.log(event.target);
}

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <ListGroup
        items={["Uno", "Dos", "Tres", "Quatro"]}
        heading="Numbers"
        onSelectItem={onSelectItem}
      ></ListGroup>
    </div>
  );
}

export default App;
