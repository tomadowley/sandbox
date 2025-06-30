/**
 * 20 Different Sorting Algorithms (ascending order)
 * Each function takes an array of numbers and returns a sorted array.
 * NEW algorithms are appended below the originals.
 */

// ...[existing 10 algorithms remain unchanged]...

// 11. Cocktail Shaker Sort
export function cocktailShakerSort(arr: number[]): number[] {
  const a = [...arr];
  let start = 0, end = a.length - 1, swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end; i > start; i--) {
      if (a[i] < a[i - 1]) {
        [a[i], a[i - 1]] = [a[i - 1], a[i]];
        swapped = true;
      }
    }
    start++;
  }
  return a;
}

// 12. Comb Sort
export function combSort(arr: number[]): number[] {
  const a = [...arr];
  let gap = a.length, swapped = true, shrink = 1.3;
  while (gap > 1 || swapped) {
    gap = Math.floor(gap / shrink);
    if (gap < 1) gap = 1;
    swapped = false;
    for (let i = 0; i + gap < a.length; i++) {
      if (a[i] > a[i + gap]) {
        [a[i], a[i + gap]] = [a[i + gap], a[i]];
        swapped = true;
      }
    }
  }
  return a;
}

// 13. Gnome Sort
export function gnomeSort(arr: number[]): number[] {
  const a = [...arr];
  let i = 0;
  while (i < a.length) {
    if (i === 0 || a[i] >= a[i - 1]) i++;
    else {
      [a[i], a[i - 1]] = [a[i - 1], a[i]];
      i--;
    }
  }
  return a;
}

// 14. Odd-Even Sort
export function oddEvenSort(arr: number[]): number[] {
  const a = [...arr];
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < a.length - 1; i += 2) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        sorted = false;
      }
    }
    for (let i = 0; i < a.length - 1; i += 2) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        sorted = false;
      }
    }
  }
  return a;
}

// 15. Pancake Sort
export function pancakeSort(arr: number[]): number[] {
  const a = [...arr];
  function flip(end: number) {
    for (let i = 0, j = end; i < j; i++, j--) {
      [a[i], a[j]] = [a[j], a[i]];
    }
  }
  for (let curr = a.length; curr > 1; curr--) {
    let mi = 0;
    for (let i = 0; i < curr; i++) if (a[i] > a[mi]) mi = i;
    if (mi !== curr - 1) {
      if (mi > 0) flip(mi);
      flip(curr - 1);
    }
  }
  return a;
}

// 16. Cycle Sort
export function cycleSort(arr: number[]): number[] {
  const a = [...arr];
  const n = a.length;
  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = a[cycleStart];
    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++)
      if (a[i] < item) pos++;
    if (pos === cycleStart) continue;
    while (item === a[pos]) pos++;
    [a[pos], item] = [item, a[pos]];
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++)
        if (a[i] < item) pos++;
      while (item === a[pos]) pos++;
      [a[pos], item] = [item, a[pos]];
    }
  }
  return a;
}

// 17. Bitonic Sort (power-of-two length arrays only)
export function bitonicSort(arr: number[]): number[] {
  const a = [...arr];
  function compareAndSwap(i: number, j: number, dir: boolean) {
    if ((a[i] > a[j]) === dir) [a[i], a[j]] = [a[j], a[i]];
  }
  function bitonicMerge(lo: number, cnt: number, dir: boolean) {
    if (cnt > 1) {
      let k = Math.floor(cnt / 2);
      for (let i = lo; i < lo + k; i++) compareAndSwap(i, i + k, dir);
      bitonicMerge(lo, k, dir);
      bitonicMerge(lo + k, k, dir);
    }
  }
  function bitonicSortRec(lo: number, cnt: number, dir: boolean) {
    if (cnt > 1) {
      let k = Math.floor(cnt / 2);
      bitonicSortRec(lo, k, true);
      bitonicSortRec(lo + k, k, false);
      bitonicMerge(lo, cnt, dir);
    }
  }
  bitonicSortRec(0, a.length, true);
  return a;
}

// 18. Pigeonhole Sort (non-negative integers)
export function pigeonholeSort(arr: number[]): number[] {
  if (arr.length === 0) return [];
  const min = Math.min(...arr), max = Math.max(...arr);
  const holes = Array(max - min + 1).fill(0);
  arr.forEach(num => holes[num - min]++);
  const result: number[] = [];
  for (let i = 0; i < holes.length; i++)
    for (let j = 0; j < holes[i]; j++) result.push(i + min);
  return result;
}

// 19. Tree Sort
export function treeSort(arr: number[]): number[] {
  class Node {
    val: number; left?: Node; right?: Node;
    constructor(val: number) { this.val = val; }
    insert(val: number) {
      if (val < this.val) this.left ? this.left.insert(val) : (this.left = new Node(val));
      else this.right ? this.right.insert(val) : (this.right = new Node(val));
    }
    inOrder(result: number[]) {
      this.left && this.left.inOrder(result);
      result.push(this.val);
      this.right && this.right.inOrder(result);
    }
  }
  if (arr.length === 0) return [];
  const root = new Node(arr[0]);
  for (let i = 1; i < arr.length; i++) root.insert(arr[i]);
  const result: number[] = [];
  root.inOrder(result);
  return result;
}

// 20. Strand Sort
export function strandSort(arr: number[]): number[] {
  function mergeStrand(a: number[], b: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] < b[j]) result.push(a[i++]);
      else result.push(b[j++]);
    }
    return result.concat(a.slice(i)).concat(b.slice(j));
  }
  let input = [...arr], output: number[] = [];
  while (input.length > 0) {
    let strand = [input[0]];
    for (let i = 1; i < input.length;) {
      if (input[i] >= strand[strand.length - 1]) strand.push(input.splice(i, 1)[0]);
      else i++;
    }
    output = mergeStrand(output, strand);
    input = input.filter(x => !strand.includes(x));
  }
  return output;
}