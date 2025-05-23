/**
 * mergeSort.test.ts
 * 
 * Tests for the Merge Sort implementation.
 * Ensures the recursive merge sort works for various input scenarios.
 */

import { mergeSort } from "./mergeSort";

describe("mergeSort", () => {
  it("sorts an unsorted array", () => {
    // Should sort an unsorted array correctly
    expect(mergeSort([10, 7, 8, 9, 1, 5])).toEqual([1, 5, 7, 8, 9, 10]);
  });

  it("handles already sorted array", () => {
    // Edge case: already sorted input
    expect(mergeSort([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("handles array with duplicates", () => {
    // Input contains duplicate values
    expect(mergeSort([4, 2, 2, 1])).toEqual([1, 2, 2, 4]);
  });

  it("handles negative numbers", () => {
    // Input includes negative numbers
    expect(mergeSort([-8, -5, -3, 0, 2])).toEqual([-8, -5, -3, 0, 2]);
  });

  it("handles empty array", () => {
    // Edge case: empty array
    expect(mergeSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    // Edge case: array with only one element
    expect(mergeSort([5])).toEqual([5]);
  });
});