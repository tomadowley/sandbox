/**
 * Performs an in-place bubble sort on an array of numbers.
 * @param arr The array of numbers to sort.
 * @returns The sorted array (sorted in place for convenience).
 */
export function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  let swapped: boolean;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap arr[j] and arr[j + 1]
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    // If no two elements were swapped by inner loop, then break
    if (!swapped) {
      break;
    }
  }
  return arr;
}