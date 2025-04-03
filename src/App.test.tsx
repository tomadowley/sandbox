import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import "./setupTests";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.getAttribute("href")).toContain("reactjs.org");
});

test("renders without crashing", () => {
  const div = document.createElement("div");
  render(<App />, { container: document.body.appendChild(div) });
  expect(div).not.toBeEmpty();
  document.body.removeChild(div);
});
