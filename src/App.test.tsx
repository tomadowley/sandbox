import React, { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "./App";

test("hello half-space virtualDOM from konstaukku", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  // eslint-disable-next-line testing-library/no-unnecessary-act
  act(() => {
    // fire events that update state
    render(<App />);
  });
  expect(linkElement).toBeInTheDocument();
});
