# Product Requirements Document

## Product Name
Maze Path Finder

## Document Purpose
This PRD describes the current product implemented in this repository. It is based on the existing codebase and is intended to capture the product idea, user experience, functional scope, and requirements without changing the application behavior.

## 1. Product Overview
Maze Path Finder is a browser-based interactive visualization tool for teaching and demonstrating pathfinding algorithms on a 2D grid maze. Users can create or edit mazes, choose an algorithm, and watch the system animate how the algorithm explores the state space and discovers a path from start to goal.

The product is primarily educational. It helps users understand how different search strategies behave, how they compare, and how obstacles affect traversal and path quality.

## 2. Problem Statement
Pathfinding and search algorithms are often taught abstractly, which makes it difficult for learners to understand how each algorithm explores space, manages frontier states, and reaches a solution. Users need a simple, visual, interactive environment where they can:

- Build or modify a maze.
- Run different search algorithms on the same problem.
- Observe frontier expansion, visited nodes, and final path construction.
- Compare algorithm characteristics such as optimality, completeness, and search behavior.

## 3. Product Vision
Create a polished, self-contained learning experience that makes state-space search intuitive through direct manipulation, real-time animation, and algorithm-specific explanations.

## 4. Target Users
- Students learning AI, algorithms, graph traversal, or search techniques.
- Instructors demonstrating state-space search concepts in class or presentations.
- Self-learners who want an intuitive visual explanation of A* search.

## 5. Goals
- Help users understand how maze search algorithms work visually.
- Let users experiment with custom and generated maze layouts.
- Show the difference between exploration and final path discovery.
- Present algorithm properties in a friendly, digestible UI.
- Keep the product lightweight and usable directly in the browser with no setup beyond opening the app.

## 6. Non-Goals
- Multiplayer or collaborative editing.
- Backend services, authentication, or persistence.
- Large-scale benchmarking or scientific performance testing.
- Weighted graphs, diagonal movement, or advanced terrain costs.
- Multi-problem simulation beyond the currently implemented maze use case.

## 7. Current Scope
The current implementation supports one problem type:

- Maze Pathfinding

The current implementation supports one algorithm:

- A* Search

The interface also includes product architecture that suggests future extensibility for additional problems, but only the maze module is currently active.

## 8. Core User Experience
### Primary Flow
1. User opens the app in the browser.
2. User sees a maze pathfinding workspace with a grid, algorithm selector, controls, and explanation panels.
3. User edits the maze by drawing walls, erasing cells, or moving the start/end nodes.
4. User optionally generates a maze automatically or adds random walls.
5. User selects A*.
6. User clicks Run.
7. The app animates frontier expansion, visited states, and the final path if found.
8. The user reviews step count, node counts, time, activity log, and algorithm explanation.
9. The user resets or clears the board and tries another algorithm or maze layout.

### Secondary Flow
1. User switches algorithms using the dropdown.
2. The algorithm information card and step explanation update immediately.
3. The current maze remains available for rerunning unless the user clears it.

## 9. Functional Requirements
### 9.1 Maze Editing
- The system must present a square grid-based maze workspace.
- The system must allow the user to draw walls.
- The system must allow the user to erase walls or previously edited cells.
- The system must allow repositioning of the start node.
- The system must allow repositioning of the end node.
- The system must prevent wall placement over start and end nodes.
- The system must prevent the start node from replacing the end node and vice versa.

### 9.2 Maze Generation
- The system must support automatic maze generation using a recursive backtracker approach.
- The system must support random wall generation.
- Automatically generated layouts must preserve usable start and end positions.

### 9.3 Algorithm Execution
- The system must allow the user to choose A*.
- The system must animate algorithm execution step by step.
- The system must visually distinguish frontier nodes, visited nodes, path nodes, walls, start, and goal.
- The system must disable conflicting run behavior while an animation is active.
- The system must support reset and clear actions.

### 9.4 Algorithm Education Layer
- The system must display the selected algorithm’s description.
- The system must display time complexity and space complexity at an educational level.
- The system must indicate whether the algorithm is optimal and complete.
- The system must show a step-by-step explanation panel for the selected algorithm.
- The system must highlight progress through the algorithm explanation while animation runs.

### 9.5 Runtime Feedback
- The system must show run status such as ready, running, exploring, path found, or failure.
- The system must display visited node count.
- The system must display frontier node count.
- The system must display the result status, including path length or no path.
- The system must display elapsed runtime for the animation run.
- The system must maintain an activity log for key events.
- The system must display total animated step count.

### 9.6 Audio and Visual Feedback
- The system must provide optional sound cues for run progress, frontier events, success, and failure.
- The system must allow the user to toggle sound on and off.
- The system should use animated and color-rich feedback to make state transitions visually clear.

### 9.7 Responsiveness
- The system must resize the maze canvas when the window size changes.
- The maze should remain usable across typical desktop viewport sizes.

## 10. User Stories
- As a student, I want to draw my own maze so I can test how algorithms behave under different obstacle patterns.
- As a learner, I want to observe A* on different maze layouts so I can understand how it balances cost and heuristic guidance.
- As an instructor, I want a visually rich animation so I can explain frontier expansion and visited states to others.
- As a user, I want a generated maze option so I can quickly create scenarios without manually drawing walls.
- As a user, I want to reset or clear the board so I can run repeated experiments quickly.
- As a learner, I want to see whether an algorithm is optimal or complete so I can connect the visualization to theory.

## 11. UX Requirements
- The UI must feel like a focused educational simulator rather than a generic form-driven app.
- The main canvas must remain the visual center of the experience.
- Controls must be simple and immediately understandable.
- The right panel must explain the selected algorithm and the current problem.
- The sidebar must communicate the problem statement and the state-space interpretation.
- Visual states must be color-coded consistently throughout the product.
- The product should be visually engaging enough for classroom demos and portfolio presentation.

## 12. Data and State Model
The implemented maze experience is based on:

- A grid of cell types: empty, wall, start, end.
- A grid of cell states: unvisited, frontier, visited, path.
- Start and goal coordinates.
- A selected algorithm.
- Animation steps generated from the algorithm run.
- UI counters and log entries derived from runtime events.

## 13. Technical Scope
- Frontend-only web application.
- Implemented using HTML, CSS, and vanilla JavaScript.
- Rendering is handled with an HTML canvas.
- No backend, database, or external API dependency is required for core functionality.
- Audio feedback is handled in-browser through the Web Audio API.

## 14. Constraints
- The product currently assumes an unweighted grid with four-directional movement.
- The maze size is fixed in the current shipped experience unless adjusted programmatically.
- The app does not persist user-created mazes between sessions.
- Performance metrics are visualization-oriented and not intended as rigorous algorithm benchmarks.

## 15. Success Criteria
The product can be considered successful in its current intended scope if:

- Users can set up and run maze scenarios without instruction.
- Users can visually understand how A* explores a maze and constructs a path.
- Users can understand whether a path was found and how the search progressed.
- Instructors or reviewers can use the app as a clean demonstration of search algorithms.

## 16. Future Expansion Opportunities
These are not part of the current required scope, but the code structure suggests room for future growth:

- Additional search algorithms such as UCS or Greedy Best-First Search.
- More state-space problems beyond maze navigation.
- Adjustable grid size and animation speed controls exposed in the UI.
- Save/load maze layouts.
- Side-by-side algorithm comparison mode.
- Mobile-specific interaction improvements.

## 17. Summary
Maze Path Finder is a single-page educational visualization tool that teaches core pathfinding concepts through interactive maze editing and animated algorithm execution. Its main value is clarity: users can build a scenario, run a search strategy, and immediately understand how the algorithm explores the state space and finds or fails to find a path.
