import { act, render, renderHook, screen } from "@testing-library/react";
import App from "./App";

describe("renders", () => {
 test("renders learn react link", async () => {
    render(<App />);

    const learnReactLink = screen.getByText(/Learn React/i);
    expect(learnReactLink).toBeInTheDocument();
    expect(true).toBe(true);
  });
});