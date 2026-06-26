import type { QuestionBank } from '../utils/questionEngine'

export interface AlgoPuzzleQ {
  id: string
  title: string
  steps: string[]
}

const EASY: AlgoPuzzleQ[] = [
  { id:'ae1', title:'Boil Water for Tea',
    steps:['Fill kettle with water','Turn on kettle','Wait for water to boil','Pour into cup with teabag','Let steep 3 minutes'] },
  { id:'ae2', title:'Making a Sandwich',
    steps:['Get two slices of bread','Spread butter on one side','Add filling ingredients','Put slices together','Slice diagonally and serve'] },
  { id:'ae3', title:'Brushing Teeth',
    steps:['Wet the toothbrush','Apply toothpaste','Brush for 2 minutes','Rinse mouth with water','Rinse the toothbrush'] },
  { id:'ae4', title:'Charging a Phone',
    steps:['Plug charger into wall outlet','Connect cable to phone','Wait until fully charged','Unplug cable from phone','Unplug charger from wall'] },
]

const MEDIUM: AlgoPuzzleQ[] = [
  { id:'am1', title:'Login Flow',
    steps:['User enters email and password','Validate input fields','Send credentials to server','Server checks database','Return success or error token'] },
  { id:'am2', title:'Linear Search',
    steps:['Start at index 0','Compare current element with target','If match found, return index','If not, move to next index','Repeat until end of array or match'] },
  { id:'am3', title:'Bubble Sort (one pass)',
    steps:['Start from index 0','Compare adjacent elements','If left > right, swap them','Move to next pair','Repeat until no swaps needed'] },
  { id:'am4', title:'Sending an HTTP Request',
    steps:['Client opens connection','Client sends request headers','Server processes request','Server sends response','Client closes connection'] },
  { id:'am5', title:'Compiling Code',
    steps:['Write source code','Lexical analysis (tokenize)','Parse into syntax tree','Generate machine code','Link and produce executable'] },
]

const HARD: AlgoPuzzleQ[] = [
  { id:'ah1', title:'Binary Search Algorithm',
    steps:['Set left=0, right=length-1','Calculate mid=(left+right)/2','If target==arr[mid], return mid','If target>arr[mid], left=mid+1 else right=mid-1','Repeat until found or left>right'] },
  { id:'ah2', title:'Depth-First Search (DFS)',
    steps:['Mark starting node as visited','Push starting node onto stack','Pop a node from stack','Visit all unvisited neighbors, mark visited, push to stack','Repeat until stack is empty'] },
  { id:'ah3', title:'Merge Sort (conceptual)',
    steps:['Divide array into two halves','Recursively sort the left half','Recursively sort the right half','Merge the two sorted halves','Return the merged sorted array'] },
  { id:'ah4', title:'Quick Sort (conceptual)',
    steps:['Choose a pivot element','Partition array: smaller left, larger right','Recursively quicksort the left partition','Recursively quicksort the right partition','Combine partitions with pivot in place'] },
  { id:'ah5', title:'TCP Three-Way Handshake',
    steps:['Client sends SYN packet','Server responds with SYN-ACK','Client sends ACK','Connection established','Data transfer begins'] },
]

const EXPERT: AlgoPuzzleQ[] = [
  { id:'ax1', title:'Dijkstra\'s Shortest Path Algorithm',
    steps:['Initialize distances: source=0, all others=infinity','Add source to priority queue','Pop node with smallest distance from queue','Relax all edges from current node (update if shorter path found)','Repeat until priority queue is empty, return distances'] },
  { id:'ax2', title:'Dynamic Programming — Longest Common Subsequence',
    steps:['Create a 2D table of size (m+1)×(n+1) initialized to 0','For each character pair, if they match, dp[i][j]=dp[i-1][j-1]+1','If they don\'t match, dp[i][j]=max(dp[i-1][j], dp[i][j-1])','Fill the table row by row','Return dp[m][n] as the LCS length'] },
  { id:'ax3', title:'A* Pathfinding Algorithm',
    steps:['Initialize open set with start node, g=0, f=heuristic(start)','Pop node with lowest f-score from open set','If node is the goal, reconstruct and return path','For each neighbor, calculate tentative g-score','If better path found, update scores and add neighbor to open set'] },
  { id:'ax4', title:'Topological Sort (Kahn\'s Algorithm)',
    steps:['Compute in-degree for every node','Add all nodes with in-degree 0 to a queue','Pop a node, add it to the result list','Decrease in-degree of all its neighbors by 1','If any neighbor\'s in-degree becomes 0, add it to queue, repeat'] },
  { id:'ax5', title:'Union-Find (Disjoint Set) with Path Compression',
    steps:['Initialize each node as its own parent (separate sets)','find(x): if x is not its own parent, recursively find root and compress path','union(x,y): find roots of x and y','If roots differ, attach one root to the other (by rank/size)','Repeat for all edges to build connected components'] },
  { id:'ax6', title:'KMP String Matching Algorithm',
    steps:['Build the failure function (longest prefix-suffix table) for the pattern','Initialize pointers i=0 (text) and j=0 (pattern)','If characters match, increment both i and j','If mismatch and j>0, set j=failure[j-1] (don\'t reset i)','If j reaches pattern length, a match is found; reset j using failure function and continue'] },
]

export const ALGO_PUZZLE_BANK: QuestionBank<AlgoPuzzleQ> = {
  easy: EASY, medium: MEDIUM, hard: HARD, expert: EXPERT,
}
