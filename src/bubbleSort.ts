/**
 * bubbleSort.ts
 *
 * Bubble Sort algorithm implementation.
 *
 * Bubble Sort is a simple, comparison-based algorithm that repeatedly steps through the list,
 * compares adjacent pairs, and swaps them if they are in the wrong order.
 * This process repeats until no swaps are required, which means the array is sorted.
 *
 * - Time Complexity: O(n^2)
 * - Space Complexity: O(1) (excluding the returned copy)
 *
 * This implementation is stable (relative order of equal elements is preserved).
 */

 /**
  * Sorts an array of numbers using the Bubble Sort algorithm.
  * @param arr Array of numbers to sort.
  * @returns New sorted array (original array is not mutated).
  */
export function bubbleSort(arr: number[]): number[] {
  // Copy input to avoid mutating the original array
  const result = [...arr];
  let n = result.length;
  let swapped: boolean;

  // Outer loop: continue until no more swaps are made
  do {
    swapped = false;
    // Each pass moves the largest unsorted element to the end
    for (let i = 1; i < n; i++) {
      // Compare adjacent elements and swap if out of order
      if (result[i - 1] > result[i]) {
        [result[i - 1], result[i]] = [result[i], result[i - 1]];
        swapped = true;
      }
    }
    // After each pass, the last element is in place, so decrease n
    n--;
  } while (swapped); // If no swaps were made, array is sorted

  // Return the sorted array (non-mutating)
  return result;
}