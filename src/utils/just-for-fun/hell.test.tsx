import React from "react";
import { render, screen } from "@testing-library/react";
import { 
  formatText, 
  calculateTotal, 
  validateInput 
} from "./hell";

/**
 * Test suite for hell.tsx utility functions
 * These tests verify the behavior of various utility functions
 * used throughout the application for text formatting, calculations,
 * and input validation.
 */

describe("formatText utility", () => {
  /**
   * Tests the formatText function with various inputs
   * to ensure proper text transformation occurs
   */
  
  test("capitalizes first letter of each word", () => {
    // Verify that the function properly capitalizes first letters
    const input = "hello world";
    const expected = "Hello World";
    expect(formatText(input)).toBe(expected);
  });

  test("handles empty string input", () => {
    // Ensure the function properly handles edge case of empty string
    expect(formatText("")).toBe("");
  });
  
  test("trims excess whitespace", () => {
    // Check if the function removes unnecessary spaces
    const input = "  too many  spaces  ";
    const expected = "Too Many Spaces";
    expect(formatText(input)).toBe(expected);
  });
});

describe("calculateTotal utility", () => {
  /**
   * Tests the calculateTotal function which sums numbers
   * and applies any relevant business logic adjustments
   */
  
  test("sums an array of numbers correctly", () => {
    // Basic summation functionality test
    const numbers = [1, 2, 3, 4, 5];
    expect(calculateTotal(numbers)).toBe(15);
  });
  
  test("returns 0 for empty array", () => {
    // Edge case: empty array should return zero
    expect(calculateTotal([])).toBe(0);
  });
  
  test("applies discount when specified", () => {
    // Test business logic with discount parameter
    const numbers = [10, 20, 30];
    const discount = 0.1; // 10% discount
    expect(calculateTotal(numbers, discount)).toBe(54); // 60 - 10%
  });
});

describe("validateInput utility", () => {
  /**
   * Tests the validateInput function which checks if user input
   * meets required criteria before processing
   */
  
  test("validates correct email format", () => {
    // Check if valid email passes validation
    expect(validateInput("user@example.com", "email")).toBe(true);
    // Check if invalid email fails validation
    expect(validateInput("not-an-email", "email")).toBe(false);
  });
  
  test("validates password requirements", () => {
    // Test password validation with strong password
    expect(validateInput("StrongP@ss123", "password")).toBe(true);
    // Test password validation with weak password
    expect(validateInput("weak", "password")).toBe(false);
  });
  
  test("throws error for unknown validation type", () => {
    // Ensure function handles unexpected validation types appropriately
    expect(() => {
      validateInput("test", "unknown-type");
    }).toThrow("Unknown validation type");
  });
});
