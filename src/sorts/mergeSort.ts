/**
 * Merge Sort implementation.
 * Sorts an array of numbers in ascending order.
 */
export function mergeSort(arr: number[]): number[] {
  // Base case: array of length 0 or 1 is already sorted
  if (arr.length <= 1) return arr;

  // Divide: split the array into left and right halves
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  // Conquer: merge the sorted halves
  return merge(left, right);

  /**
   * Helper function to merge two sorted arrays into one sorted array.
   */
  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    // Compare elements from both arrays and add the smaller one
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    // Append any remaining elements from left or right
    return [...result, ...left.slice(i), ...right.slice(j)];
  }
}