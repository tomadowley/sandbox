import { insertionSort } from "./insertionSort";

/**
 * Test suite for insertionSort algorithm.
 * Covers key edge cases and common usage scenarios.
 */
describe("insertionSort", () => {
  it("sorts an empty array", () => {
    // Should handle empty input with no errors
    expect(insertionSort([])).toEqual([]);
  });

  it("sorts an already sorted array", () => {
    // Already sorted input should remain unchanged
    expect(insertionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a reverse sorted array", () => {
    // Should sort descending input correctly
    expect(insertionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with duplicates", () => {
    // Duplicates should be preserved and sorted
    expect(insertionSort([3, 1, 2, 3, 2])).toEqual([1, 2, 2, 3, 3]);
  });

  it("sorts an array with negative numbers", () => {
    // Should properly handle negative numbers
    expect(insertionSort([0, -1, 5, -10, 3])).toEqual([-10, -1, 0, 3, 5]);
  });
});