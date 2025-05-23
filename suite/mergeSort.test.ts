import { mergeSort } from "./mergeSort";

/**
 * Test suite for mergeSort algorithm.
 * Includes tests for edge cases and correctness in all main scenarios.
 */
describe("mergeSort", () => {
  it("sorts an empty array", () => {
    // Should handle empty input gracefully
    expect(mergeSort([])).toEqual([]);
  });

  it("sorts an already sorted array", () => {
    // Sorted input should remain unchanged
    expect(mergeSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a reverse sorted array", () => {
    // Should reverse a descending array
    expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with duplicates", () => {
    // Array with repeated values is sorted and duplicates retained
    expect(mergeSort([3, 1, 2, 3, 2])).toEqual([1, 2, 2, 3, 3]);
  });

  it("sorts an array with negative numbers", () => {
    // Should sort negative and positive numbers together
    expect(mergeSort([0, -1, 5, -10, 3])).toEqual([-10, -1, 0, 3, 5]);
  });
});