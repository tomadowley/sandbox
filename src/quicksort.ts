/**
 * Performs an in-place quick sort (Lomuto partition) on an array of numbers.
 * @param arr The array of numbers to sort.
 * @returns The sorted array (sorted in place for convenience).
 */
export function quickSort(arr: number[]): number[] {
  quickSortHelper(arr, 0, arr.length - 1);
  return arr;
}

function quickSortHelper(arr: number[], low: number, high: number): void {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSortHelper(arr, low, pi - 1);
    quickSortHelper(arr, pi + 1, high);
  }
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}