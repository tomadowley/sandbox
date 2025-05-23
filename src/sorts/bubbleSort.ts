/**
 * Bubble Sort implementation.
 * Sorts an array of numbers in ascending order.
 */
export function bubbleSort(arr: number[]): number[] {
  // Make a copy of the input array to avoid mutating the original
  const a = [...arr];
  // Outer loop for each pass
  for (let i = 0; i < a.length; i++) {
    // Inner loop for comparing adjacent elements
    for (let j = 0; j < a.length - i - 1; j++) {
      // Swap if elements are in the wrong order
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
    // Largest element at the end after each pass
  }
  // Return the sorted array
  return a;
}