// data.js
// all the problem info, algo descriptions etc
// keeping it all in one place is easier - sanskriti

var problemList = {
  maze:         { label: 'Maze Pathfinding',   icon: '🧩', tag: 'State Space',  unit: 1 },
};

// which algos are available for each problem
var problemAlgos = {
  maze:         ['BFS', 'DFS', 'A*'],
};

// descriptions shown in the problem section
var problemDesc = {
  maze:        'Navigate through a grid maze to find the shortest path from the starting point (purple) to the goal (red). You can draw walls to create obstacles or erase them. Watch as different search algorithms explore the maze and find optimal paths.',
};

// info for each algorithm
var algoInfo = {
  'BFS': {
    name: 'Breadth-First Search', color: '#22d3ee',
    desc: 'Queue (FIFO). Explores level by level. Guarantees shortest path on unweighted graphs.',
    tc: 'O(V+E)', sc: 'O(V)', isOptimal: true, isComplete: true
  },
  'DFS': {
    name: 'Depth-First Search', color: '#fb923c',
    desc: 'Stack (LIFO). Dives deep before backtracking. Memory-efficient but not always optimal.',
    tc: 'O(V+E)', sc: 'O(V)', isOptimal: false, isComplete: true
  },
  'A*': {
    name: 'A* Search', color: '#4ade80',
    desc: 'f(n) = g(n) + h(n). Path cost + Manhattan heuristic. Optimal when h is admissible.',
    tc: 'O(b^d)', sc: 'O(b^d)', isOptimal: true, isComplete: true
  },
};

// step by step explanations shown in panel
var algoStepsList = {
  'BFS': [
    'Add Start to Queue (FIFO)',
    'Dequeue front node, mark VISITED (blue)',
    'If node = Goal, trace path back',
    'Add unvisited neighbors to Queue (amber)',
    'Repeat - explores level by level',
  ],
  'DFS': [
    'Push Start onto Stack (LIFO)',
    'Pop top node, mark VISITED (blue)',
    'If node = Goal, trace path back',
    'Push unvisited neighbors onto Stack (amber)',
    'Repeat - dives deep before backtracking',
  ],
  'A*': [
    'Add Start to priority queue with f=0',
    'Pop node with lowest f = g + h',
    'If node = Goal, trace path back',
    'For each neighbor: g+1 and h = Manhattan dist',
    'If cheaper path, update and push (amber)',
    'Repeat - always expands most promising node',
  ],
};
