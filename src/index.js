import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/layout.css";
import App from "./App.js";

//styles
import "./styles/bars.css";
import "./styles/home.css";
import "@fontsource/montserrat";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
