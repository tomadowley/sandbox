/**
 * bubbleSort.ts
 * 
 * Implements the Bubble Sort algorithm.
 * 
 * Bubble Sort repeatedly steps through the list, compares adjacent elements,
 * and swaps them if they are in the wrong order. This continues until the list
 * is sorted. It's simple but inefficient for large datasets.
 * 
 * Time Complexity: O(n^2)
 * Space Complexity: O(1) (not accounting for the returned copy)
 */

/**
 * Bubble Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns Sorted array.
 */
export function bubbleSort(arr: number[]): number[] {
  // Make a shallow copy to avoid mutating the original array
  const result = [...arr];
  let n = result.length;
  let swapped: boolean;
  do {
    swapped = false;
    // After each pass, the largest element bubbles to the end
    for (let i = 1; i < n; i++) {
      if (result[i - 1] > result[i]) {
        // Swap adjacent elements if out of order
        [result[i - 1], result[i]] = [result[i], result[i - 1]];
        swapped = true;
      }
    }
    n--;
  } while (swapped); // Continue until no swaps are needed
  return result;
}