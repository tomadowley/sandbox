/**
 * Merge Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns A new sorted array.
 *
 * Merge Sort is a divide-and-conquer algorithm.
 * It divides the array into halves, recursively sorts them,
 * and merges the sorted halves.
 */
export function mergeSort(arr: number[]): number[] {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr.slice();

  // Find the middle index
  const mid = Math.floor(arr.length / 2);

  // Recursively sort left and right halves
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Merge the two sorted halves
  return merge(left, right);
}

/**
 * Merges two sorted arrays into one sorted array.
 * @param left Sorted left half
 * @param right Sorted right half
 * @returns Merged sorted array
 */
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  // Walk through both arrays, picking the smaller element at each step
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // If there are remaining elements, append them
  return [...result, ...left.slice(i), ...right.slice(j)];
}