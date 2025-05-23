/**
 * quickSort.ts
 * 
 * Implements the Quick Sort algorithm.
 * 
 * Quick Sort is a divide-and-conquer algorithm that selects a 'pivot' element
 * and partitions the array into subarrays of elements less than and greater than the pivot,
 * then recursively sorts the subarrays.
 * 
 * Time Complexity: Average O(n log n), Worst O(n^2)
 * Space Complexity: O(log n) (due to recursion stack)
 */

/**
 * Quick Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns Sorted array.
 */
export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  // Choose the first element as pivot
  const pivot = arr[0];
  // Partition the array into elements less than and greater or equal to the pivot
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  // Recursively sort the partitions and combine with pivot
  return [...quickSort(left), pivot, ...quickSort(right)];
}