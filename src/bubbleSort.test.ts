/**
 * bubbleSort.test.ts
 * 
 * Tests for the Bubble Sort implementation.
 * Each test checks a different aspect of sorting correctness, including edge cases.
 */

import { bubbleSort } from "./bubbleSort";

describe("bubbleSort", () => {
  it("sorts an unsorted array", () => {
    // Standard test: should sort an unsorted array
    expect(bubbleSort([3, 1, 2])).toEqual([1, 2, 3]);
  });

  it("handles already sorted array", () => {
    // Edge case: input is already sorted
    expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("handles array with duplicates", () => {
    // Input contains duplicate values
    expect(bubbleSort([2, 1, 2, 3])).toEqual([1, 2, 2, 3]);
  });

  it("handles negative numbers", () => {
    // Input includes negative numbers
    expect(bubbleSort([0, -1, 5, -3])).toEqual([-3, -1, 0, 5]);
  });

  it("handles empty array", () => {
    // Edge case: empty input array
    expect(bubbleSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    // Edge case: array with only one element
    expect(bubbleSort([42])).toEqual([42]);
  });
});