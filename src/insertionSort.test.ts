/**
 * insertionSort.test.ts
 * 
 * Tests for the Insertion Sort implementation.
 * Validates the algorithm with several test cases, including edge cases.
 */

import { insertionSort } from "./insertionSort";

describe("insertionSort", () => {
  it("sorts an unsorted array", () => {
    // Typical unsorted input
    expect(insertionSort([9, 7, 5, 3, 1])).toEqual([1, 3, 5, 7, 9]);
  });

  it("handles already sorted array", () => {
    // Edge case: already sorted input
    expect(insertionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles array with duplicates", () => {
    // Input contains duplicate values
    expect(insertionSort([1, 4, 2, 4, 3])).toEqual([1, 2, 3, 4, 4]);
  });

  it("handles negative numbers", () => {
    // Input includes negative numbers
    expect(insertionSort([-3, -1, -2, 0])).toEqual([-3, -2, -1, 0]);
  });

  it("handles empty array", () => {
    // Edge case: empty array
    expect(insertionSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    // Edge case: array with only one element
    expect(insertionSort([0])).toEqual([0]);
  });
});