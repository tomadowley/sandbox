import { bubbleSort } from "./bubbleSort";

/**
 * Test suite for bubbleSort algorithm.
 * Each test ensures bubbleSort works correctly for different input scenarios.
 */
describe("bubbleSort", () => {
  it("sorts an empty array", () => {
    // Bubble sort should return an empty array when given one
    expect(bubbleSort([])).toEqual([]);
  });

  it("sorts an already sorted array", () => {
    // Already sorted input should remain unchanged
    expect(bubbleSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a reverse sorted array", () => {
    // Should correctly sort an array in descending order
    expect(bubbleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with duplicates", () => {
    // Duplicates should be handled and sorted properly
    expect(bubbleSort([3, 1, 2, 3, 2])).toEqual([1, 2, 2, 3, 3]);
  });

  it("sorts an array with negative numbers", () => {
    // Should correctly sort negative and positive numbers
    expect(bubbleSort([0, -1, 5, -10, 3])).toEqual([-10, -1, 0, 3, 5]);
  });
});