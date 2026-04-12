// data.js
// all the problem info, algo descriptions etc
// keeping it all in one place is easier - sanskriti

// List of problems shown in the sidebar. Each item maps to a module key.
var problemList = {
  maze:         { label: 'Maze Pathfinding',   icon: '🧩', tag: 'State Space',  unit: 1 },
};

// Available algorithms per problem (populates the dropdown).
var problemAlgos = {
  maze:         ['A*'],
};

// Problem statement copy shown in the left sidebar.
var problemDesc = {
  maze:        'Guide the explorer through a forest maze to reach his home. Draw or erase trees to shape the paths and watch A* search the safest route from the start to the house.',
};

// Metadata used to render the algorithm card (name, complexity, optimality).
var algoInfo = {
  'A*': {
    name: 'A* Search', color: '#4ade80',
    desc: 'f(n) = g(n) + h(n). Path cost + Manhattan heuristic. Optimal when h is admissible.',
    tc: 'O(b^d)', sc: 'O(b^d)', isOptimal: true, isComplete: true
  },
};

// Step-by-step explanation used in the "How It Works" panel.
var algoStepsList = {
  'A*': [
    'Add Start to priority queue with f=0',
    'Pop node with lowest f = g + h',
    'If node = Goal, trace path back',
    'For each neighbor: g+1 and h = Manhattan dist',
    'If cheaper path, update and push (amber)',
    'Repeat - always expands most promising node',
  ],
};
