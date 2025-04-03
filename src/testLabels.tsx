import React from "react";
import { render, screen } from "@testing-library/react";
import { LibraryLabels } from "./components/LibraryLabels";
import { SponsorLogo } from "./components/SponsorLogo";
import "./setupTests";

test("renders all category labels correctly", () => {
  render(<LibraryLabels />);
  const designSystemsLabel = screen.getByText(/design systems/i);
  const componentLibrariesLabel = screen.getByText(/component libraries/i);
  const cssFrameworksLabel = screen.getByText(/css frameworks/i);
  
  expect(designSystemsLabel).toBeInTheDocument();
  expect(componentLibrariesLabel).toBeInTheDocument();
  expect(cssFrameworksLabel).toBeInTheDocument();
});

test("renders sponsor logo with correct alt text", () => {
  render(<SponsorLogo />);
  const logoElement = screen.getByAltText(/sponsor logo/i);
  
  expect(logoElement).toBeInTheDocument();
  expect(logoElement.tagName).toBe("IMG");
  expect(logoElement).toHaveAttribute("src");
});

test("renders header text according to brand guidelines", () => {
  render(<LibraryLabels />);
  const headerText = screen.getByText(
    /a collection of design systems and component libraries that follow the HCDS Global definitions/i
  );
  
  expect(headerText).toBeInTheDocument();
  expect(headerText.tagName).toMatch(/^H\d$/); // Ensure it's a heading tag
});

test("verifies interactive behavior of category labels", () => {
  render(<LibraryLabels />);
  const categoryLabels = screen.getAllByTestId(/category-label/i);
  
  expect(categoryLabels.length).toBeGreaterThan(0);
  categoryLabels.forEach(label => {
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute("role", "button");
  });
});
