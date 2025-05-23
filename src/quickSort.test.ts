/**
 * quickSort.test.ts
 * 
 * Tests for the Quick Sort implementation.
 * Checks correctness on a variety of input cases and edge conditions.
 */

import { quickSort } from "./quickSort";

describe("quickSort", () => {
  it("sorts an unsorted array", () => {
    // Should sort an unsorted array with duplicates
    expect(quickSort([3, 6, 8, 10, 1, 2, 1])).toEqual([1, 1, 2, 3, 6, 8, 10]);
  });

  it("handles already sorted array", () => {
    // Edge case: already sorted input
    expect(quickSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles array with duplicates", () => {
    // Input contains duplicate values
    expect(quickSort([5, 3, 5, 2])).toEqual([2, 3, 5, 5]);
  });

  it("handles negative numbers", () => {
    // Input includes negative numbers
    expect(quickSort([-2, 0, 1, -1])).toEqual([-2, -1, 0, 1]);
  });

  it("handles empty array", () => {
    // Edge case: empty array
    expect(quickSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    // Edge case: array with only one element
    expect(quickSort([7])).toEqual([7]);
  });
});