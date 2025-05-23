import { quickSort } from "./quickSort";

describe("quickSort", () => {
  it("sorts an empty array", () => {
    expect(quickSort([])).toEqual([]);
  });

  it("sorts a single-element array", () => {
    expect(quickSort([1])).toEqual([1]);
  });

  it("sorts an already sorted array", () => {
    expect(quickSort([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("sorts a reverse sorted array", () => {
    expect(quickSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a random array", () => {
    expect(quickSort([3, 1, 4, 1, 5, 9, 2])).toEqual([1, 1, 2, 3, 4, 5, 9]);
  });

  it("does not mutate the original array", () => {
    const arr = [3, 2, 1];
    quickSort(arr);
    expect(arr).toEqual([3, 2, 1]);
  });
});