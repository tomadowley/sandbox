/**
 * Selection Sort implementation.
 * Sorts an array of numbers in ascending order.
 */
export function selectionSort(arr: number[]): number[] {
  // Copy input array to avoid side effects
  const a = [...arr];
  // Iterate over each array element
  for (let i = 0; i < a.length; i++) {
    // Assume the current index is the minimum
    let minIdx = i;
    // Find the index of the smallest element in the remaining unsorted array
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    // Swap if a new minimum is found
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
    }
    // After each iteration, the smallest element is at position i
  }
  // Return the sorted array
  return a;
}