import "bootstrap/dist/css/bootstrap.min.css";
import App from "./components/App.jsx";
import React from "react";
import { render } from "react-dom";

const appDiv = document.getElementById("root");
render(<App />, appDiv);