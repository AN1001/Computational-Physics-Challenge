import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { MathJaxContext } from "better-react-mathjax";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MathJaxContext>
      <App />
    </MathJaxContext>
  </React.StrictMode>
);
