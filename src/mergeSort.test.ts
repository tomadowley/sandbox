import { mergeSort } from "./mergeSort";

describe("mergeSort", () => {
  it("sorts an empty array", () => {
    expect(mergeSort([])).toEqual([]);
  });

  it("sorts a single-element array", () => {
    expect(mergeSort([1])).toEqual([1]);
  });

  it("sorts an already sorted array", () => {
    expect(mergeSort([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("sorts a reverse sorted array", () => {
    expect(mergeSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with negative numbers", () => {
    expect(mergeSort([-3, -1, -4, -2])).toEqual([-4, -3, -2, -1]);
  });

  it("sorts an array with mixed positive and negative numbers", () => {
    expect(mergeSort([3, -1, 4, -2, 0])).toEqual([-2, -1, 0, 3, 4]);
  });

  it("sorts an array with repeated elements", () => {
    expect(mergeSort([2, 2, 2, 2])).toEqual([2, 2, 2, 2]);
    expect(mergeSort([3, 1, 1, 5, 5, 3])).toEqual([1, 1, 3, 3, 5, 5]);
  });

  it("sorts a large array", () => {
    const arr = Array.from({ length: 100 }, (_, i) => 100 - i);
    expect(mergeSort(arr)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
  });

  it("sorts a random array", () => {
    const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    const sorted = [...arr].sort((a, b) => a - b);
    expect(mergeSort(arr)).toEqual(sorted);
  });

  it("does not mutate the original array", () => {
    const arr = [3, 2, 1];
    const arrCopy = [...arr];
    mergeSort(arr);
    expect(arr).toEqual(arrCopy);
  });

  it("sorts an array with all equal elements", () => {
    expect(mergeSort([7, 7, 7, 7, 7])).toEqual([7, 7, 7, 7, 7]);
  });

  it("sorts an array with large and small numbers", () => {
    expect(mergeSort([1000000, -1000000, 0, 42, -42])).toEqual([-1000000, -42, 0, 42, 1000000]);
  });
});