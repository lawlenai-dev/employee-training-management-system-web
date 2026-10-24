import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppProviders from "./app/AppProviders";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('ไม่พบ element ที่มี id="root"');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>,
);
