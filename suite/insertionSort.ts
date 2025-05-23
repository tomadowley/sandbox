/**
 * Insertion Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function insertionSort(arr: number[]): number[] {
    // Create a shallow copy so we don't mutate the original array
    const result = arr.slice();

    // Start from the second element and insert into the sorted portion
    for (let i = 1; i < result.length; i++) {
        let key = result[i]; // The value to insert
        let j = i - 1;

        // Shift elements to the right to make space for key
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j];
            j--;
        }
        // Insert the key at the correct location
        result[j + 1] = key;
    }

    return result;
}