/**
 * Bubble Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns A new sorted array.
 */
export function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  for (let i = 0; i < result.length - 1; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }
  return result;
}