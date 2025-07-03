/**
 * Performs an in-place insertion sort on an array of numbers.
 * @param arr The array of numbers to sort.
 * @returns The sorted array (sorted in place for convenience).
 */
export function insertionSort(arr: number[]): number[] {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}