import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("sets document title to Hi", () => {
  render(<App />);
  expect(document.title).toBe("Hi");
});
