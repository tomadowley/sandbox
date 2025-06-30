/**
 * 10 Different Sorting Algorithms (ascending order)
 * Each function takes an array of numbers and returns a sorted array.
 */

// 1. Bubble Sort
export function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
  }
  return a;
}

// 2. Selection Sort
export function selectionSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
}

// 3. Insertion Sort
export function insertionSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}

// 4. Merge Sort
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 5. Quick Sort
export function quickSort(arr: number[]): number[] {
  if (arr.length < 2) return arr;
  const pivot = arr[arr.length - 1];
  const less = arr.slice(0, -1).filter(x => x <= pivot);
  const greater = arr.slice(0, -1).filter(x => x > pivot);
  return [...quickSort(less), pivot, ...quickSort(greater)];
}

// 6. Heap Sort
export function heapSort(arr: number[]): number[] {
  const a = [...arr];
  const n = a.length;
  function heapify(n: number, i: number) {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(n, largest);
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(i, 0);
  }
  return a;
}

// 7. Shell Sort
export function shellSort(arr: number[]): number[] {
  const a = [...arr];
  let n = a.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let temp = a[i], j;
      for (j = i; j >= gap && a[j - gap] > temp; j -= gap) {
        a[j] = a[j - gap];
      }
      a[j] = temp;
    }
  }
  return a;
}

// 8. Counting Sort (only non-negative integers)
export function countingSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  if (min < 0) throw new Error('Counting sort only supports non-negative values');
  const count = Array(max + 1).fill(0);
  arr.forEach(num => count[num]++);
  const result: number[] = [];
  for (let i = 0; i < count.length; i++) {
    for (let j = 0; j < count[i]; j++) result.push(i);
  }
  return result;
}

// 9. Radix Sort (only non-negative integers)
export function radixSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  if (arr.some(num => num < 0)) throw new Error('Radix sort only supports non-negatives');
  const max = Math.max(...arr);
  let exp = 1;
  let a = [...arr];
  while (Math.floor(max / exp) > 0) {
    const output = Array(a.length).fill(0);
    const count = Array(10).fill(0);
    for (let i = 0; i < a.length; i++) {
      const digit = Math.floor(a[i] / exp) % 10;
      count[digit]++;
    }
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      output[--count[digit]] = a[i];
    }
    a = output;
    exp *= 10;
  }
  return a;
}

// 10. Bucket Sort (only non-negative floats in [0,1))
export function bucketSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  if (arr.some(num => num < 0 || num >= 1))
    throw new Error('Bucket sort requires numbers in [0, 1)');
  const n = arr.length;
  const buckets: number[][] = Array.from({ length: n }, () => []);
  arr.forEach(num => {
    const idx = Math.floor(num * n);
    buckets[idx].push(num);
  });
  return buckets.reduce((acc, bucket) => acc.concat(insertionSort(bucket)), []);
}