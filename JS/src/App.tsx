import Navbar from "./Navbar";
import "./App.css";
import { useState } from "react";
import TaskSetA from "./TaskSetA";

function App() {
  const [activePage, setActivePage] = useState("1-2");

  const renderPage = () => {
    switch (activePage) {
      case "1-2":
        return <TaskSetA></TaskSetA>;
      case "3":
        return <h1>Task 3</h1>;
      case "4-7":
        return <h1>Tasks 4-7</h1>;
      case "Extensions":
        return <h1>Extensions</h1>;
      default:
        return <h1>Error</h1>;
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
