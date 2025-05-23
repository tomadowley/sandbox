import { insertionSort } from "./insertionSort";

describe("insertionSort", () => {
  it("sorts an empty array", () => {
    expect(insertionSort([])).toEqual([]);
  });

  it("sorts a single-element array", () => {
    expect(insertionSort([1])).toEqual([1]);
  });

  it("sorts an already sorted array", () => {
    expect(insertionSort([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("sorts a reverse sorted array", () => {
    expect(insertionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a random array", () => {
    expect(insertionSort([3, 1, 4, 1, 5, 9, 2])).toEqual([1, 1, 2, 3, 4, 5, 9]);
  });

  it("does not mutate the original array", () => {
    const arr = [3, 2, 1];
    insertionSort(arr);
    expect(arr).toEqual([3, 2, 1]);
  });
});