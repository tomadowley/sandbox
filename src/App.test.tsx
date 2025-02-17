import { act, render, renderHook, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter, Link } from "react-router-dom";

describe("renders", () => {
	test("renders learn react link", async () => {
	render(<App />);

		expect(screen.getByText("Learn React")).toBeTruthy();
	});
});