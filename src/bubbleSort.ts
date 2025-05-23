/**
 * Bubble Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns A new sorted array.
 *
 * Bubble Sort repeatedly steps through the list,
 * compares adjacent elements and swaps them if they are in the wrong order.
 * This process is repeated until the list is sorted.
 */
export function bubbleSort(arr: number[]): number[] {
  // Make a copy so the original array is not mutated
  const result = [...arr];
  // Outer loop: each pass ensures the largest unsorted element bubbles to the end
  for (let i = 0; i < result.length - 1; i++) {
    // Inner loop: compare adjacent elements
    for (let j = 0; j < result.length - i - 1; j++) {
      // If left element is bigger, swap with right element
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
    // After each outer loop iteration, the i largest items are in place at the end
  }
  return result;
}