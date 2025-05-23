/**
 * Quick Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function quickSort(arr: number[]): number[] {
    // Base case: arrays of length 0 or 1 are already sorted
    if (arr.length <= 1) return arr.slice();

    // Recursively sort subarrays
    function sort(array: number[]): number[] {
        if (array.length <= 1) return array;

        // Choose the last element as pivot
        const pivot = array[array.length - 1];
        const left: number[] = [];
        const right: number[] = [];

        // Partition the array into left and right
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] < pivot) {
                left.push(array[i]);
            } else {
                right.push(array[i]);
            }
        }

        // Recursively sort left and right, then concatenate results
        return [...sort(left), pivot, ...sort(right)];
    }

    // Start sort with a copy of the input
    return sort(arr.slice());
}