/**
 * Insertion Sort implementation.
 * Sorts an array of numbers in ascending order.
 */
export function insertionSort(arr: number[]): number[] {
  // Make a copy to avoid mutating the original array
  const a = [...arr];
  // Loop over array, starting from index 1
  for (let i = 1; i < a.length; i++) {
    let key = a[i];
    let j = i - 1;
    // Move elements of a[0..i-1] that are greater than key to one position ahead
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    // Insert key at the correct position
    a[j + 1] = key;
  }
  // Return the sorted array
  return a;
}