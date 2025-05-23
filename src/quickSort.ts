/**
 * quickSort.ts
 *
 * Quick Sort algorithm implementation.
 *
 * Quick Sort is an efficient, divide-and-conquer algorithm that selects a "pivot" element
 * and partitions the array into two subarrays: elements less than the pivot and elements
 * greater than or equal to the pivot. It recursively sorts the subarrays and combines them.
 *
 * - Time Complexity: Average O(n log n), Worst O(n^2)
 * - Space Complexity: O(log n) (due to recursion stack, not including returned copy)
 *
 * This implementation is not stable.
 */

 /**
  * Sorts an array of numbers using the Quick Sort algorithm.
  * @param arr Array of numbers to sort.
  * @returns Sorted array (input is not mutated).
  */
export function quickSort(arr: number[]): number[] {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr;

  // Choose the first element as the pivot
  const pivot = arr[0];

  // Partition the remaining elements into left (less than pivot) and right (greater or equal)
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);

  // Recursively quicksort the partitions and combine with pivot
  return [...quickSort(left), pivot, ...quickSort(right)];
}