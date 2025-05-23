export function bubbleSort(arr: number[]): number[] {
  const result = [...arr];
  let n = result.length;
  let swapped: boolean;
  do {
    swapped = false;
    for (let i = 1; i < n; i++) {
      if (result[i - 1] > result[i]) {
        [result[i - 1], result[i]] = [result[i], result[i - 1]];
        swapped = true;
      }
    }
    n--;
  } while (swapped);
  return result;
}