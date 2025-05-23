import { quickSort } from "./quickSort";

describe("quickSort", () => {
  it("sorts an unsorted array", () => {
    expect(quickSort([3, 6, 8, 10, 1, 2, 1])).toEqual([1, 1, 2, 3, 6, 8, 10]);
  });

  it("handles already sorted array", () => {
    expect(quickSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("handles array with duplicates", () => {
    expect(quickSort([5, 3, 5, 2])).toEqual([2, 3, 5, 5]);
  });

  it("handles negative numbers", () => {
    expect(quickSort([-2, 0, 1, -1])).toEqual([-2, -1, 0, 1]);
  });

  it("handles empty array", () => {
    expect(quickSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    expect(quickSort([7])).toEqual([7]);
  });
});