/**
 * selectionSort.ts
 *
 * Selection Sort algorithm implementation.
 *
 * Selection Sort works by repeatedly finding the minimum element from the unsorted part of the array
 * and moving it to the beginning. The algorithm maintains two subarrays: the sorted and unsorted.
 * At each step, the minimum value in the unsorted subarray is selected and swapped with the leftmost unsorted element.
 *
 * - Time Complexity: O(n^2)
 * - Space Complexity: O(1) (excluding the returned copy)
 *
 * This implementation is not stable (relative order of equal elements is not necessarily preserved).
 */

 /**
  * Sorts an array of numbers using the Selection Sort algorithm.
  * @param arr Array of numbers to sort.
  * @returns New sorted array (does not mutate input).
  */
export function selectionSort(arr: number[]): number[] {
  // Copy input to avoid mutating the original array
  const result = [...arr];
  const n = result.length;

  // Move boundary of sorted/unsorted subarrays one by one
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    // Find the minimum element in the unsorted subarray
    for (let j = i + 1; j < n; j++) {
      if (result[j] < result[minIdx]) {
        minIdx = j;
      }
    }
    // Swap minimum element with the first element of the unsorted subarray
    if (minIdx !== i) {
      [result[i], result[minIdx]] = [result[minIdx], result[i]];
    }
    // After each pass, elements before i are sorted
  }
  // Return the sorted array
  return result;
}