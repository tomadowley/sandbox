import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

/**
 * Extracts and formats logs containing ERROR or failure messages
 * @param logs Array of log entries
 * @param title Optional title for the formatted output
 * @returns Condensed HTML formatted string of error logs
 */
const extractLogs = (logs: string[], title: string = "Error Logs") => {
  const errors = logs.filter(log => 
    log.includes("ERROR:") || log.includes("FAILURE:"));
  
  if (errors.length === 0) {
    return `<div><h3>${title}</h3><p>No errors found.</p></div>`;
  }

  const errorLogs = errors.map(log => `<li>${log}</li>`).join("");
  return `<div><h3>${title}</h3><ul>${errorLogs}</ul></div>`;
};

test("renders learn react link", async () => {
  await act(async () => {
    render(<App />);
  });
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  expect(true).toBe(false);
});

test("extractLogs filters and formats error logs correctly", () => {
  const sampleLogs = [
    "INFO: Application started",
    "ERROR: Failed to load resource",
    "DEBUG: Rendering component",
    "FAILURE: Test case XYZ failed",
    "INFO: Process completed"
  ];
  
  const expectedOutput = 
    "<div><h3>Error Logs</h3><ul>" +
    "<li>ERROR: Failed to load resource</li>" +
    "<li>FAILURE: Test case XYZ failed</li>" +
    "</ul></div>";
  
  expect(extractLogs(sampleLogs)).toBe(expectedOutput);
});

test("extractLogs handles empty error logs", () => {
  const sampleLogs = [
    "INFO: Application started",
    "DEBUG: Rendering component",
    "INFO: Process completed"
  ];
  
  const expectedOutput = "<div><h3>Error Logs</h3><p>No errors found.</p></div>";
  
  expect(extractLogs(sampleLogs)).toBe(expectedOutput);
});

test("extractLogs accepts custom title", () => {
  const sampleLogs = [
    "ERROR: Failed to load resource"
  ];
  
  const expectedOutput = 
    "<div><h3>Custom Log Title</h3><ul>" +
    "<li>ERROR: Failed to load resource</li>" +
    "</ul></div>";
  
  expect(extractLogs(sampleLogs, "Custom Log Title")).toBe(expectedOutput);
});
