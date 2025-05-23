/**
 * selectionSort.ts
 * 
 * Implements the Selection Sort algorithm.
 * 
 * Selection Sort divides the input list into two parts: the sublist of items already sorted,
 * built up from left to right, and the sublist of items remaining to be sorted. 
 * It repeatedly selects the minimum element from the unsorted sublist and moves it to the sorted sublist.
 * 
 * Time Complexity: O(n^2)
 * Space Complexity: O(1) (not accounting for the returned copy)
 */

/**
 * Selection Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns Sorted array.
 */
export function selectionSort(arr: number[]): number[] {
  // Make a shallow copy to avoid mutating the original array
  const result = [...arr];
  const n = result.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    // Find the minimum element in the unsorted part
    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIdx]) {
        minIdx = j;
      }
    }
    // Swap the found minimum with the first unsorted element
    if (minIdx !== i) {
      [result[i], result[minIdx]] = [result[minIdx], result[i]];
    }
  }
  return result;
}