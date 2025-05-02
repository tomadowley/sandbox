import React from "react";
import { render, screen } from "@testing-library/react";

// Mock SethioGame so we don't load Phaser in Jest (unimplemented in jsdom)
jest.mock("./SethioGame", () => () => <div>SethioGame</div>);

import App from "./App";

test("renders sethio platformer heading", () => {
  render(<App />);
  const heading = screen.getByText(/sethio platformer/i);
  expect(heading).toBeInTheDocument();
});
