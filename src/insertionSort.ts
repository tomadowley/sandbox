/**
 * Insertion Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns A new sorted array.
 */
export function insertionSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 1; i < result.length; i++) {
    let j = i;
    while (j > 0 && result[j - 1] > result[j]) {
      [result[j], result[j - 1]] = [result[j - 1], result[j]];
      j--;
    }
  }
  return result;
}