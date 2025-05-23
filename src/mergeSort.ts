/**
 * mergeSort.ts
 * 
 * Implements the Merge Sort algorithm.
 * 
 * Merge Sort is a divide-and-conquer algorithm that recursively splits the array into halves,
 * sorts each half, and merges them back together. It is stable and efficient for large datasets.
 * 
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */

/**
 * Merge Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns Sorted array.
 */
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  // Recursively split the array into halves
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Merge the sorted halves
  return merge(left, right);
}

/**
 * Helper function to merge two sorted arrays.
 */
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  // Compare elements from both arrays and merge them in sorted order
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  // Concatenate any remaining elements
  return result.concat(left.slice(i)).concat(right.slice(j));
}