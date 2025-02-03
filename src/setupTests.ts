// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

import { act } from "react";
import { render } from "@testing-library/react";
import App from "./App";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  act: (callback: any) => {
    let result: any;
    act(() => {
      result = callback();
    });
    return result;
  },
}));
