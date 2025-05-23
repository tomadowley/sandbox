/**
 * Selection Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function selectionSort(arr: number[]): number[] {
    const result = arr.slice();
    for (let i = 0; i < result.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < result.length; j++) {
            if (result[j] < result[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [result[i], result[minIdx]] = [result[minIdx], result[i]];
        }
    }
    return result;
}