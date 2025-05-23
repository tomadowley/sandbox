/**
 * insertionSort.ts
 * 
 * Implements the Insertion Sort algorithm.
 * 
 * Insertion Sort builds the sorted array one item at a time by repeatedly
 * taking the next element and inserting it into the correct position in the sorted part.
 * Efficient for small and nearly sorted datasets.
 * 
 * Time Complexity: O(n^2)
 * Space Complexity: O(1) (not accounting for the returned copy)
 */

/**
 * Insertion Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns Sorted array.
 */
export function insertionSort(arr: number[]): number[] {
  // Make a shallow copy to avoid mutating the original array
  const result = [...arr];
  for (let i = 1; i < result.length; i++) {
    let key = result[i];
    let j = i - 1;
    // Move elements greater than key one position ahead
    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }
    result[j + 1] = key;
  }
  return result;
}