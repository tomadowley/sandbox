import { mergeSort } from "./mergeSort";

describe("mergeSort", () => {
  it("sorts an unsorted array", () => {
    expect(mergeSort([10, 7, 8, 9, 1, 5])).toEqual([1, 5, 7, 8, 9, 10]);
  });

  it("handles already sorted array", () => {
    expect(mergeSort([1, 2, 3, 4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("handles array with duplicates", () => {
    expect(mergeSort([4, 2, 2, 1])).toEqual([1, 2, 2, 4]);
  });

  it("handles negative numbers", () => {
    expect(mergeSort([-8, -5, -3, 0, 2])).toEqual([-8, -5, -3, 0, 2]);
  });

  it("handles empty array", () => {
    expect(mergeSort([])).toEqual([]);
  });

  it("handles single-element array", () => {
    expect(mergeSort([5])).toEqual([5]);
  });
});