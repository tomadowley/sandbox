import { act, render, renderHook, screen } from "@testing-library/react";
import App from "./App";

describe("renders", () => {
	test("renders learn react link", async () => {
	render(<App />);

		expect(screen.getByText("Learn React")).toBeTruthy();

		expect(true).toBe(true);
	});
});