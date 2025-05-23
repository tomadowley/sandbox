/**
 * bubbleSort.test.ts
 *
 * Test suite for the Bubble Sort algorithm implementation.
 * 
 * Bubble Sort is a simple sorting algorithm that repeatedly steps through the list,
 * compares adjacent elements, and swaps them if they are in the wrong order.
 * This test suite checks that our implementation produces correct results across
 * a range of input types, including edge cases and special scenarios.
 */

import { bubbleSort } from "./bubbleSort";

describe("bubbleSort", () => {
  // Tests basic sorting capability on a typical unsorted array.
  it("sorts an unsorted array", () => {
    expect(bubbleSort([3, 1, 2])).toEqual([1, 2, 3]);
  });

  // Tests that a sorted array remains unchanged (Bubble Sort is stable).
  it("handles already sorted array", () => {
    expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3]);
  });

  // Ensures duplicates are handled correctly and order is preserved for equal elements.
  it("handles array with duplicates", () => {
    expect(bubbleSort([2, 1, 2, 3])).toEqual([1, 2, 2, 3]);
  });

  // Verifies correct sorting in the presence of negative numbers and zero.
  it("handles negative numbers", () => {
    expect(bubbleSort([0, -1, 5, -3])).toEqual([-3, -1, 0, 5]);
  });

  // Checks that the implementation doesn't fail or mutate when given an empty array.
  it("handles empty array", () => {
    expect(bubbleSort([])).toEqual([]);
  });

  // Checks the trivial case of a single-element array (should return the same array).
  it("handles single-element array", () => {
    expect(bubbleSort([42])).toEqual([42]);
  });
});