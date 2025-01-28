import "@testing-library/jest-dom";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { act } from "react";

configure({ adapter: new Adapter() });

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Warning: An update to %s inside a test was not wrapped in act") ||
      args[0].includes("Warning: Do not await the result of calling act"))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
