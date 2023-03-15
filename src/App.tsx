import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { DataContextProvider } from "./Contexts/dataContext";
import { Modul1 } from "./components/modul1/modul1";

function App() {
  return (
    <div className="App">
      <p>App:</p>
      <DataContextProvider>
        <Modul1 />
      </DataContextProvider>
    </div>
  );
}

export default App;
