/**
 * Quick Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns A new sorted array.
 *
 * Quick Sort is a divide-and-conquer algorithm.
 * It selects a pivot element, partitions the array into elements less than and greater than the pivot,
 * and recursively sorts the partitions.
 */
export function quickSort(arr: number[]): number[] {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) return arr.slice();

  // Choose the first element as the pivot and the rest as 'rest'
  const [pivot, ...rest] = arr;

  // Partition the array into left (smaller than pivot) and right (greater or equal)
  const left = rest.filter(x => x < pivot);
  const right = rest.filter(x => x >= pivot);

  // Recursively sort the partitions and combine them with the pivot
  return [...quickSort(left), pivot, ...quickSort(right)];
}