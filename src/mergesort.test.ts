import { mergeSort } from "./mergesort";

describe("mergeSort", () => {
  it("sorts an array of positive numbers", () => {
    const arr = [5, 2, 9, 1, 5, 6];
    expect(mergeSort(arr)).toEqual([1, 2, 5, 5, 6, 9]);
  });

  it("sorts an array with negative numbers", () => {
    const arr = [0, -3, 4, -1, 2];
    expect(mergeSort(arr)).toEqual([-3, -1, 0, 2, 4]);
  });

  it("sorts an already sorted array", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(mergeSort(arr)).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with repeated numbers", () => {
    const arr = [2, 3, 2, 1, 3];
    expect(mergeSort(arr)).toEqual([1, 2, 2, 3, 3]);
  });

  it("returns an empty array when input is empty", () => {
    expect(mergeSort([])).toEqual([]);
  });

  it("sorts a single-element array", () => {
    expect(mergeSort([42])).toEqual([42]);
  });
});