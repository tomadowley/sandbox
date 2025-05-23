import { bubbleSort } from "./bubbleSort";

describe("bubbleSort", () => {
  it("sorts an empty array", () => {
    expect(bubbleSort([])).toEqual([]);
  });

  it("sorts a single-element array", () => {
    expect(bubbleSort([1])).toEqual([1]);
  });

  it("sorts an already sorted array", () => {
    expect(bubbleSort([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("sorts a reverse sorted array", () => {
    expect(bubbleSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with negative numbers", () => {
    expect(bubbleSort([-3, -1, -4, -2])).toEqual([-4, -3, -2, -1]);
  });

  it("sorts an array with mixed positive and negative numbers", () => {
    expect(bubbleSort([3, -1, 4, -2, 0])).toEqual([-2, -1, 0, 3, 4]);
  });

  it("sorts an array with repeated elements", () => {
    expect(bubbleSort([2, 2, 2, 2])).toEqual([2, 2, 2, 2]);
    expect(bubbleSort([3, 1, 1, 5, 5, 3])).toEqual([1, 1, 3, 3, 5, 5]);
  });

  it("sorts a large array", () => {
    const arr = Array.from({ length: 100 }, (_, i) => 100 - i);
    expect(bubbleSort(arr)).toEqual(Array.from({ length: 100 }, (_, i) => i + 1));
  });

  it("sorts a random array", () => {
    expect(bubbleSort([3, 1, 4, 1, 5, 9, 2])).toEqual([1, 1, 2, 3, 4, 5, 9]);
  });

  it("does not mutate the original array", () => {
    const arr = [3, 2, 1];
    const arrCopy = [...arr];
    bubbleSort(arr);
    expect(arr).toEqual(arrCopy);
  });

  it("sorts an array with all equal elements", () => {
    expect(bubbleSort([7, 7, 7, 7, 7])).toEqual([7, 7, 7, 7, 7]);
  });

  it("sorts an array with large and small numbers", () => {
    expect(bubbleSort([1000000, -1000000, 0, 42, -42])).toEqual([-1000000, -42, 0, 42, 1000000]);
  });
});