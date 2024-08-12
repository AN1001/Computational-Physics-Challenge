import Navbar from "./Navbar";
import "./App.css";
import { useEffect, useState } from "react";
import TaskSetA from "./TaskSetA";
import TaskSetB from "./TaskSetB";
import TaskSetC from "./TaskSetC";
import TaskSetD from "./TaskSetD";
import TaskSetE from "./TaskSetE";
import TaskSetF from "./TaskSetF";
import GlobeHolder from "./GlobeHolder";
import Slider from "./Slider";

function App() {
  let [activePage, setActivePage] = useState("1-2");
  const [lat, setLat] = useState(100);
  const [long, setLong] = useState(-50);
  const [theta, settheta] = useState(0);

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
      case "8":
        return <TaskSetE></TaskSetE>;
      case "9":
        return <TaskSetF></TaskSetF>;
      case "Extensions":
        return (
          <>
            <div className="d-flex flex-wrap position-absolute">
              <Slider
                min={-90}
                max={90}
                onChange={setLat}
                value={lat}
                title="Latitude"
              ></Slider>
              <Slider
                min={-90}
                max={90}
                onChange={setLong}
                value={long}
                title="Longitude"
              ></Slider>
              <Slider
                min={-90}
                max={90}
                onChange={settheta}
                value={theta}
                title="Theta"
              ></Slider>
            </div>
            <GlobeHolder lat={lat} long={long}></GlobeHolder>
          </>
        );
      default:
        return <h1>Error, this page does not exist</h1>;
    }
  };

  useEffect(() => {
    activePage = "Extensions2";
    renderPage();
    console.log("use2");
  }, [lat, long]);

  return (
    <div>
      <Navbar changeHome={setActivePage} activeHeader={activePage}></Navbar>
      <div>{renderPage()}</div>
    </div>
  );
}

export default App;
