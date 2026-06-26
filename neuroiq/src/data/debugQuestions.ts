import type { QuestionBank } from '../utils/questionEngine'

export interface BugQ {
  id: string
  code: string
  bugLine: number
  options: string[]
  answer: string
  explanation: string
}

const EASY: BugQ[] = [
  { id:'be1', code:`x = 10\nif x = 10:\n  print("Ten")`, bugLine:1,
    options:['Wrong indentation','Should use ==','Missing colon','Wrong variable'],
    answer:'Should use ==', explanation:'= is assignment, == is comparison' },
  { id:'be2', code:`def greet(name):\n  return "Hello " + name\n\ngreet("World")`, bugLine:3,
    options:['Missing print()','Wrong string','name is undefined','Wrong function'],
    answer:'Missing print()', explanation:'Function returns value but it\'s never printed' },
  { id:'be3', code:`nums = [1,2,3]\nfor num in nums\n  print(num)`, bugLine:1,
    options:['Missing colon after for','nums is wrong','Should be range()','Wrong variable'],
    answer:'Missing colon after for', explanation:'for...in statement requires a colon at end' },
  { id:'be4', code:`def add(a, b):\n  return a - b\n\nresult = add(3, 4)`, bugLine:1,
    options:['Wrong function name','Should be a + b','Missing return','Wrong params'],
    answer:'Should be a + b', explanation:'Subtraction instead of addition' },
  { id:'be5', code:`name = "Alice"\nprint('Hello, ' + name)\nprint('Age: ' + 25)`, bugLine:2,
    options:['Missing quotes','Cannot concatenate string and int','Wrong variable','Missing comma'],
    answer:'Cannot concatenate string and int', explanation:'25 must be converted to str(25)' },
]

const MEDIUM: BugQ[] = [
  { id:'bm1', code:`arr = [1, 2, 3, 4, 5]\nprint(arr[5])`, bugLine:1,
    options:['Wrong variable','Index out of range','Missing brackets','Syntax error'],
    answer:'Index out of range', explanation:'Array has 5 elements (indices 0-4); index 5 is invalid' },
  { id:'bm2', code:`count = 0\nwhile count < 5:\n  print(count)\ncount += 1`, bugLine:3,
    options:['Wrong condition','count++ not valid','count += 1 is outside loop','Missing break'],
    answer:'count += 1 is outside loop', explanation:'Increment must be inside the while loop or it never terminates' },
  { id:'bm3', code:`def factorial(n):\n  if n == 0:\n    return 1\n  return n * factorial(n)`, bugLine:3,
    options:['Wrong base case','Should call factorial(n-1)','Missing return','Wrong operator'],
    answer:'Should call factorial(n-1)', explanation:'Recursive call must decrease n, else infinite recursion' },
  { id:'bm4', code:`def is_even(n):\n  if n % 2 = 0:\n    return True\n  return False`, bugLine:1,
    options:['Should use ==','Wrong modulo','Missing colon','Wrong indentation'],
    answer:'Should use ==', explanation:'Comparison needs == not =' },
  { id:'bm5', code:`total = 0\nfor i in range(1, 10):\n  total = total + i\nprint(total)  # expects sum 1 to 10`, bugLine:1,
    options:['range should be (1, 11)','Wrong variable','Missing colon','total init wrong'],
    answer:'range should be (1, 11)', explanation:'range(1,10) excludes 10, only sums 1-9' },
  { id:'bm6', code:`def find_max(lst):\n  max_val = 0\n  for num in lst:\n    if num > max_val:\n      max_val = num\n  return max_val\n\nfind_max([-5, -2, -8])`, bugLine:1,
    options:['Initialize max_val with -infinity','Wrong loop','Wrong comparison','Missing return'],
    answer:'Initialize max_val with -infinity', explanation:'Starting at 0 fails for all-negative lists' },
]

const HARD: BugQ[] = [
  { id:'bh1', code:`def binary_search(arr, target):\n  left, right = 0, len(arr)\n  while left < right:\n    mid = (left+right)//2\n    if arr[mid] == target:\n      return mid\n    elif arr[mid] < target:\n      left = mid\n    else:\n      right = mid\n  return -1`, bugLine:6,
    options:['Should be left = mid + 1','right should be len(arr)-1','mid calculation wrong','while condition wrong'],
    answer:'Should be left = mid + 1', explanation:'Without +1, left never increases past mid → infinite loop' },
  { id:'bh2', code:`def bubble_sort(arr):\n  n = len(arr)\n  for i in range(n):\n    for j in range(n-i):\n      if arr[j] > arr[j+1]:\n        arr[j], arr[j+1] = arr[j+1], arr[j]\n  return arr`, bugLine:4,
    options:['range should be (n-i-1)','Wrong comparison','Wrong swap syntax','i loop wrong'],
    answer:'range should be (n-i-1)', explanation:'arr[j+1] goes out of bounds when j=n-i-1 without the -1' },
  { id:'bh3', code:`class Node:\n  def __init__(self, val):\n    self.val = val\n    self.next = None\n\ndef has_cycle(head):\n  slow = fast = head\n  while fast and fast.next:\n    slow = slow.next\n    fast = fast.next\n  return slow == fast`, bugLine:9,
    options:['fast should move 2 steps','slow should move 2 steps','Wrong comparison','Missing null check'],
    answer:'fast should move 2 steps', explanation:'Floyd\'s cycle detection requires fast=fast.next.next' },
  { id:'bh4', code:`def fib_memo(n, memo={}):\n  if n in memo:\n    return memo[n]\n  if n <= 1:\n    return n\n  result = fib_memo(n-1) + fib_memo(n-2)\n  return result`, bugLine:7,
    options:['Forgot to store in memo before returning','Wrong base case','Should use n-2 and n-3','Mutable default argument is fine'],
    answer:'Forgot to store in memo before returning', explanation:'memo[n]=result is missing — memoization never actually caches' },
  { id:'bh5', code:`def quicksort(arr):\n  if len(arr) <= 1:\n    return arr\n  pivot = arr[0]\n  left = [x for x in arr if x < pivot]\n  right = [x for x in arr if x > pivot]\n  return quicksort(left) + [pivot] + quicksort(right)`, bugLine:7,
    options:['Duplicates of pivot are dropped','Wrong pivot choice','Missing equal case','Wrong base case'],
    answer:'Duplicates of pivot are dropped', explanation:'Elements equal to pivot (other than itself) vanish — need an "equal" list' },
]

const EXPERT: BugQ[] = [
  { id:'bx1', code:`// LeetCode Hard: Merge K Sorted Lists\nfunction mergeKLists(lists) {\n  let result = [];\n  for (let list of lists) {\n    while (list) {\n      result.push(list.val);\n      list = list.next;\n    }\n  }\n  return result.sort((a,b) => a - b);\n}\n// Bug: O(N log N) when O(N log K) expected via heap`, bugLine:9,
    options:['Should use a min-heap for O(N log K)','Sort comparator is wrong','Missing null check','push() is wrong method'],
    answer:'Should use a min-heap for O(N log K)', explanation:'Sorting the full result is O(N log N); optimal solution uses a heap of size K for O(N log K)' },
  { id:'bx2', code:`// LeetCode Hard: LRU Cache\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    return this.cache.get(key);\n  }\n  put(key, value) {\n    this.cache.set(key, value);\n  }\n}`, bugLine:7,
    options:['get() must re-insert key to mark recently used','Map doesn\'t support get','capacity is never checked','constructor is wrong'],
    answer:'get() must re-insert key to mark recently used', explanation:'Without delete+set to refresh order, and without evicting oldest entry when capacity exceeded, this isn\'t a real LRU' },
  { id:'bx3', code:`// LeetCode Hard: Trapping Rain Water\nfunction trap(height) {\n  let total = 0;\n  for (let i = 0; i < height.length; i++) {\n    let leftMax = Math.max(...height.slice(0, i));\n    let rightMax = Math.max(...height.slice(i));\n    total += Math.min(leftMax, rightMax) - height[i];\n  }\n  return total;\n}`, bugLine:5,
    options:['O(n²) time — should use two-pointer/DP for O(n)','Math.min/max are swapped','Off-by-one in slice','total formula is wrong'],
    answer:'O(n²) time — should use two-pointer/DP for O(n)', explanation:'Recomputing leftMax/rightMax for every i is O(n²); optimal is precomputed arrays or two-pointer O(n)' },
  { id:'bx4', code:`// LeetCode Hard: Word Ladder (BFS)\nfunction ladderLength(beginWord, endWord, wordList) {\n  let queue = [[beginWord, 1]];\n  let wordSet = new Set(wordList);\n  while (queue.length) {\n    let [word, level] = queue.shift();\n    if (word === endWord) return level;\n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        let newWord = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);\n        if (wordSet.has(newWord)) {\n          queue.push([newWord, level+1]);\n        }\n      }\n    }\n  }\n  return 0;\n}`, bugLine:10,
    options:['Visited words are never removed from wordSet — causes infinite revisits','BFS should be DFS','queue.shift() is wrong','char code range is wrong'],
    answer:'Visited words are never removed from wordSet — causes infinite revisits', explanation:'Without wordSet.delete(newWord), the same word gets re-queued forever, blowing up runtime/memory' },
  { id:'bx5', code:`// LeetCode Hard: Median of Two Sorted Arrays (must be O(log(m+n)))\nfunction findMedian(nums1, nums2) {\n  let merged = [...nums1, ...nums2].sort((a,b)=>a-b);\n  let mid = Math.floor(merged.length/2);\n  if (merged.length % 2 === 0) {\n    return (merged[mid-1] + merged[mid]) / 2;\n  }\n  return merged[mid];\n}`, bugLine:2,
    options:['Merging+sorting is O((m+n)log(m+n)) not O(log(m+n))','Median formula is wrong','Off-by-one in mid','spread operator is wrong'],
    answer:'Merging+sorting is O((m+n)log(m+n)) not O(log(m+n))', explanation:'The required complexity demands binary search on partitions, not a full merge+sort' },
  { id:'bx6', code:`// LeetCode Hard: N-Queens count\nfunction totalNQueens(n) {\n  let count = 0;\n  function backtrack(row, cols) {\n    if (row === n) { count++; return; }\n    for (let col = 0; col < n; col++) {\n      if (cols.includes(col)) continue;\n      cols.push(col);\n      backtrack(row+1, cols);\n      cols.pop();\n    }\n  }\n  backtrack(0, []);\n  return count;\n}`, bugLine:6,
    options:['Missing diagonal conflict checks','row index is wrong','cols.includes is too slow but not wrong','backtrack signature is wrong'],
    answer:'Missing diagonal conflict checks', explanation:'Only checks column reuse — diagonal attacks (row-col and row+col) are never validated, overcounting solutions' },
]

export const DEBUG_BANK: QuestionBank<BugQ> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}
