import { render, screen } from "@testing-library/react";
import App from "./App";
import { act } from "react";
import { mocked } from "ts-jest/utils";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next");

const mockedUseTranslation = mocked(useTranslation);
describe("App", () => {
  mockedUseTranslation.mockImplementation(() => ({
    t: (str) => str,
    i18n: {
      changeLanguage: jest.fn(),
      language: "pl",
    },
  }));
  test("renders learn react link", () => {
    act(() => {
      render(<App />);
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });
  });
});