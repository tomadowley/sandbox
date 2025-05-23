/**
 * Merge Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr.slice();

    function merge(left: number[], right: number[]): number[] {
        let result: number[] = [], i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (left[i] < right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }
        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    function sort(array: number[]): number[] {
        if (array.length <= 1) return array;
        const mid = Math.floor(array.length / 2);
        return merge(sort(array.slice(0, mid)), sort(array.slice(mid)));
    }

    return sort(arr.slice());
}