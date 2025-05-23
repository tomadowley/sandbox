/**
 * Insertion Sort implementation.
 * @param arr Array of numbers to sort.
 * @returns A new sorted array.
 *
 * Insertion Sort builds the sorted array one item at a time,
 * inserting each new item into the correct position among the previously sorted items.
 */
export function insertionSort(arr: number[]): number[] {
  // Make a copy so the original array is not mutated
  const result = [...arr];

  // Start from the second element and insert it into the sorted part of the array
  for (let i = 1; i < result.length; i++) {
    let j = i;
    // Move the current element leftward as long as it's smaller than the previous element
    while (j > 0 && result[j - 1] > result[j]) {
      // Swap with previous element
      [result[j], result[j - 1]] = [result[j - 1], result[j]];
      j--;
    }
    // After this loop, result[0..i] is sorted
  }
  return result;
}