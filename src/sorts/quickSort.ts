/**
 * Quick Sort implementation.
 * Sorts an array of numbers in ascending order.
 */
export function quickSort(arr: number[]): number[] {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr;
  // Choose the last element as pivot
  const pivot = arr[arr.length - 1];
  // Arrays to hold elements less than or greater than the pivot
  const left: number[] = [];
  const right: number[] = [];
  // Partition the array into left and right based on pivot
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  // Recursively sort left and right, and concatenate the result
  return [...quickSort(left), pivot, ...quickSort(right)];
}