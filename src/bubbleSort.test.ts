import { bubbleSort } from "./bubbleSort";

describe("bubbleSort", () => {
  it("sorts an unsorted array", () => {
    expect(bubbleSort([3, 1, 2])).toEqual([1, 2, 3]);
  });

  it("handles already sorted array", () => {
    expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("handles array with duplicates", () => {
    expect(bubbleSort([2, 1, 2, 3])).toEqual([1, 2, 2, 3]);
  });

  it("handles negative numbers", () => {
    expect(bubbleSort([0, -1, 5, -3])).toEqual([-3, -1, 0, 5]);
  });

  it("handles empty array", () => {
    expect(bubbleSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    expect(bubbleSort([42])).toEqual([42]);
  });
});