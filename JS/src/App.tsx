import Navbar from "./Navbar";
import "./App.css";
import { useState } from "react";
import TaskSetA from "./TaskSetA";
import TaskSetB from "./TaskSetB";
import TaskSetC from "./TaskSetC";
import TaskSetD from "./TaskSetD";

function App() {
  const [activePage, setActivePage] = useState("1-2");

  const renderPage = () => {
    switch (activePage) {
      case "1-2":
        return <TaskSetA></TaskSetA>;
      case "3":
        return <TaskSetB></TaskSetB>;
      case "4-7":
        return <TaskSetC></TaskSetC>;
      case "5-7":
        return <TaskSetD></TaskSetD>;
      case "Extensions":
        return <h1>Extensions</h1>;
      default:
        return <h1>Error, this page does not exist</h1>;
    }
  };

  return (
    <div>
      <Navbar changeHome={setActivePage} activeHeader={activePage}></Navbar>
      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
