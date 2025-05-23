import { selectionSort } from "./selectionSort";

/**
 * Test suite for selectionSort algorithm.
 * Ensures robust sorting across a variety of input cases.
 */
describe("selectionSort", () => {
  it("sorts an empty array", () => {
    // Should return empty array when input is empty
    expect(selectionSort([])).toEqual([]);
  });

  it("sorts an already sorted array", () => {
    // Test for idempotence on sorted input
    expect(selectionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a reverse sorted array", () => {
    // Sorts input in descending order
    expect(selectionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with duplicates", () => {
    // Handles duplicate values correctly
    expect(selectionSort([3, 1, 2, 3, 2])).toEqual([1, 2, 2, 3, 3]);
  });

  it("sorts an array with negative numbers", () => {
    // Negative numbers are sorted alongside positives
    expect(selectionSort([0, -1, 5, -10, 3])).toEqual([-10, -1, 0, 3, 5]);
  });
});