/**
 * Bubble Sort implementation (ascending order).
 * @param arr Array of numbers to sort (will not mutate original).
 * @returns New sorted array.
 */
export function bubbleSort(arr: number[]): number[] {
    // Create a shallow copy so we don't mutate the original array
    const result = arr.slice();
    let n = result.length;
    let swapped: boolean;

    // Continue looping until no swaps are made in a pass
    do {
        swapped = false;
        // Each pass bubbles the largest element to the end
        for (let i = 1; i < n; i++) {
            // Compare adjacent elements and swap if out of order
            if (result[i - 1] > result[i]) {
                [result[i - 1], result[i]] = [result[i], result[i - 1]];
                swapped = true; // Mark that we made a swap
            }
        }
        n--; // Each pass places the next largest element at the end
    } while (swapped); // Stop when no swaps are made

    return result;
}