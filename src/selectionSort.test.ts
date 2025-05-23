/**
 * selectionSort.test.ts
 * 
 * Tests for the Selection Sort implementation.
 * Each test ensures the sorting algorithm works for common and edge cases.
 */

import { selectionSort } from "./selectionSort";

describe("selectionSort", () => {
  it("sorts an unsorted array", () => {
    // Should sort a typical unsorted array
    expect(selectionSort([5, 1, 4, 2, 8])).toEqual([1, 2, 4, 5, 8]);
  });

  it("handles already sorted array", () => {
    // Edge case: already sorted input
    expect(selectionSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it("handles array with duplicates", () => {
    // Input contains duplicate values
    expect(selectionSort([2, 3, 2, 1])).toEqual([1, 2, 2, 3]);
  });

  it("handles negative numbers", () => {
    // Input includes negative numbers
    expect(selectionSort([-5, 0, 3, -2])).toEqual([-5, -2, 0, 3]);
  });

  it("handles empty array", () => {
    // Edge case: empty array
    expect(selectionSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    // Edge case: array with only one element
    expect(selectionSort([7])).toEqual([7]);
  });
});