import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders squash game UI", () => {
  render(<App />);
  
  // Check for the title
  const titleElement = screen.getByText(/squash game/i);
  expect(titleElement).toBeInTheDocument();
  
  // Check for welcome message
  const welcomeElement = screen.getByText(/welcome to squash!/i);
  expect(welcomeElement).toBeInTheDocument();
  
  // Check for start game button
  const startButton = screen.getByText(/start game/i);
  expect(startButton).toBeInTheDocument();
  
  // Check for instructions
  const instructionElement = screen.getByText(/how to play:/i);
  expect(instructionElement).toBeInTheDocument();
});