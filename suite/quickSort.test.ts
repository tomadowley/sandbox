import { quickSort } from "./quickSort";

/**
 * Test suite for quickSort algorithm.
 * Includes a variety of scenarios to ensure robust correctness.
 */
describe("quickSort", () => {
  it("sorts an empty array", () => {
    // Should return empty array for empty input
    expect(quickSort([])).toEqual([]);
  });

  it("sorts an already sorted array", () => {
    // Should not change a sorted input
    expect(quickSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a reverse sorted array", () => {
    // Can sort a descending array into ascending order
    expect(quickSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with duplicates", () => {
    // Duplicates are handled and sorted correctly
    expect(quickSort([3, 1, 2, 3, 2])).toEqual([1, 2, 2, 3, 3]);
  });

  it("sorts an array with negative numbers", () => {
    // Handles negative values as expected
    expect(quickSort([0, -1, 5, -10, 3])).toEqual([-10, -1, 0, 3, 5]);
  });
});