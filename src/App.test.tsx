import React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";

test("sets document title to Hi", () => {
  act(() => {
    render(<App />);
  });
  expect(document.title).toBe("Hi");
});
