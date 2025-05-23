/**
 * Selection Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function selectionSort(arr: number[]): number[] {
    // Create a shallow copy so we don't mutate the original array
    const result = arr.slice();

    // Move the boundary of the sorted and unsorted subarray
    for (let i = 0; i < result.length - 1; i++) {
        let minIdx = i; // Assume the current position is the minimum

        // Find the actual minimum element in the unsorted portion
        for (let j = i + 1; j < result.length; j++) {
            if (result[j] < result[minIdx]) {
                minIdx = j;
            }
        }

        // Swap the found minimum with the first unsorted element
        if (minIdx !== i) {
            [result[i], result[minIdx]] = [result[minIdx], result[i]];
        }
    }

    return result;
}