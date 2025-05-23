/**
 * Merge Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function mergeSort(arr: number[]): number[] {
    // Base case: arrays of length 0 or 1 are already sorted
    if (arr.length <= 1) return arr.slice();

    // Merge two sorted arrays into one sorted array
    function merge(left: number[], right: number[]): number[] {
        let result: number[] = [];
        let i = 0, j = 0;

        // Compare elements from both arrays, adding the smaller each time
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }
        // Add remaining elements from both arrays (if any)
        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    // Recursively split and merge the array
    function sort(array: number[]): number[] {
        if (array.length <= 1) return array;
        const mid = Math.floor(array.length / 2);
        // Split array into left and right halves
        const left = array.slice(0, mid);
        const right = array.slice(mid);
        // Sort and merge
        return merge(sort(left), sort(right));
    }

    // Call the recursive sort with a copy of the input
    return sort(arr.slice());
}