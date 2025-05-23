/**
 * Insertion Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function insertionSort(arr: number[]): number[] {
    const result = arr.slice();
    for (let i = 1; i < result.length; i++) {
        let key = result[i];
        let j = i - 1;
        while (j >= 0 && result[j] > key) {
            result[j + 1] = result[j];
            j--;
        }
        result[j + 1] = key;
    }
    return result;
}