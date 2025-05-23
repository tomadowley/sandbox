/**
 * Quick Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns A new sorted array.
 */
export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr.slice();
  const [pivot, ...rest] = arr;
  const left = rest.filter(x => x < pivot);
  const right = rest.filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}