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

  it("sorts a random array", () => {
    expect(bubbleSort([3, 1, 4, 1, 5, 9, 2])).toEqual([1, 1, 2, 3, 4, 5, 9]);
  });

  it("does not mutate the original array", () => {
    const arr = [3, 2, 1];
    bubbleSort(arr);
    expect(arr).toEqual([3, 2, 1]);
  });
});