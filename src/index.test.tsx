import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

it("renders the title", () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  expect(document.title).toBe("yo");
});
