import { console } from 'console';

/**
 * Bubble sort algorithm implementation.
 *
 * @param {Array<number>} arr - The array to be sorted.
 * @returns {Array<number>} The sorted array.
 */
export function bubbleSort(arr: Array<number>): Array<number> {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // Flag to track if any swaps were made in the current iteration.
    let swapped = false;

    // Iterate over the array from the first element to the (n-i-1)th element.
    for (let j = 0; j < n - i - 1; j++) {
      // If the current element is greater than the next element, swap them.
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // If no swaps were made in the current iteration, the array is already sorted.
    if (!swapped) {
      break;
    }
  }

  return arr;
}

// Example usage:
// const arr = [64, 34, 25, 12, 22, 11, 90];
// console.log("Original array:", arr);
// console.log("Sorted array:", bubbleSort(arr));
