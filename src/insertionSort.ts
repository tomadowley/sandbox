/**
 * insertionSort.ts
 *
 * Insertion Sort algorithm implementation.
 *
 * Insertion Sort builds the sorted array one element at a time, by inserting each
 * new element into its correct position relative to the already sorted portion.
 * It is efficient for small or nearly sorted datasets and is stable.
 *
 * - Time Complexity: O(n^2)
 * - Space Complexity: O(1) (excluding the returned copy)
 *
 * This implementation is stable.
 */

 /**
  * Sorts an array of numbers using the Insertion Sort algorithm.
  * @param arr Array of numbers to sort.
  * @returns Sorted array (input is not mutated).
  */
export function insertionSort(arr: number[]): number[] {
  // Copy input to avoid mutating the original array
  const result = [...arr];

  // Start from the second element and insert into the sorted part
  for (let i = 1; i < result.length; i++) {
    let key = result[i]; // Current element to insert
    let j = i - 1;
    // Move elements of result[0..i-1] that are greater than key to one position ahead
    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }
    // Place key after the last smaller element found (or at the start)
    result[j + 1] = key;
  }
  // Return the sorted array
  return result;
}