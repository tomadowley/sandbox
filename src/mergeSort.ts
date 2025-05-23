/**
 * mergeSort.ts
 *
 * Merge Sort algorithm implementation.
 *
 * Merge Sort is a stable, divide-and-conquer algorithm that recursively splits
 * the array into halves, sorts each half, and merges them back together.
 * Suitable for large datasets due to its O(n log n) performance.
 *
 * - Time Complexity: O(n log n)
 * - Space Complexity: O(n)
 *
 * This implementation is stable (relative order of equal elements is preserved).
 */

 /**
  * Sorts an array of numbers using the Merge Sort algorithm.
  * @param arr Array of numbers to sort.
  * @returns Sorted array (input is not mutated).
  */
export function mergeSort(arr: number[]): number[] {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr;

  // Divide: find the midpoint and split array
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Conquer: merge the sorted halves
  return merge(left, right);
}

/**
 * Merges two sorted arrays into a single sorted array.
 * @param left First sorted array.
 * @param right Second sorted array.
 * @returns Merged sorted array.
 */
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  // Compare elements and merge in sorted order
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // Append any remaining elements
  return result.concat(left.slice(i)).concat(right.slice(j));
}