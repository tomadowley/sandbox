import { selectionSort } from "./selectionSort";

describe("selectionSort", () => {
  it("sorts an empty array", () => {
    expect(selectionSort([])).toEqual([]);
  });

  it("sorts an already sorted array", () => {
    expect(selectionSort([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts a reverse sorted array", () => {
    expect(selectionSort([5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5]);
  });

  it("sorts an array with duplicates", () => {
    expect(selectionSort([3, 1, 2, 3, 2])).toEqual([1, 2, 2, 3, 3]);
  });

  it("sorts an array with negative numbers", () => {
    expect(selectionSort([0, -1, 5, -10, 3])).toEqual([-10, -1, 0, 3, 5]);
  });
});