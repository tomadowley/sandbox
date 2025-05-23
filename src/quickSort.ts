/**
 * Quick Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns Sorted array.
 */
export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}