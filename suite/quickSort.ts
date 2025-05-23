/**
 * Quick Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function quickSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr.slice();

    function sort(array: number[]): number[] {
        if (array.length <= 1) return array;
        const pivot = array[array.length - 1];
        const left: number[] = [];
        const right: number[] = [];
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] < pivot) {
                left.push(array[i]);
            } else {
                right.push(array[i]);
            }
        }
        return [...sort(left), pivot, ...sort(right)];
    }

    return sort(arr.slice());
}