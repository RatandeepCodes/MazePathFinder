// maze.js
// maze pathfinding - A* Search
// done by Ratandeep Singh


var mazeMod = (function() {

  // grid dimensions
  var numRows = 22;
  var numCols = 22;
  var cellSize = 0;

  // grid arrays
  var gridType  = []; // 0=empty 1=wall 2=start 3=end
  var gridState = []; // 0=unvisited 1=frontier 2=visited 3=path

  // start and end positions
  var startRow = 0, startCol = 0;
  var endRow   = 0, endCol   = 0;

  // cell type constants
  var EMPTY = 0, WALL = 1, START = 2, END = 3;
  var UNVIS = 0, FRONT = 1, VIS = 2, PATH = 3;

  // current draw tool
  var drawTool = 'wall';
  var mouseIsDown = false;
  var walkerEl = null;
  var homeEl = null;

  // Compute pixel size of each cell based on canvas container size.
  function calcCellSize() {
    var area = document.getElementById('canvas-area');
    var maxW = area.clientWidth  - 28;
    var maxH = area.clientHeight - 28;
    cellSize = Math.max(8, Math.floor(Math.min(maxW / numCols, maxH / numRows)));
    myCanvas.width  = cellSize * numCols;
    myCanvas.height = cellSize * numRows;
  }

  // Cache overlay DOM elements (walker + home) so we don't query every frame.
  function ensureOverlayElements() {
    if (!walkerEl) walkerEl = document.getElementById('walker');
    if (!homeEl) homeEl = document.getElementById('home-marker');
  }

  // Scale overlay elements to the current cell size so they stay proportional.
  function updateOverlaySizes() {
    ensureOverlayElements();
    if (!walkerEl || !homeEl) return;
    var walkerSize = Math.max(22, Math.round(cellSize * 1.05));
    var homeSize = Math.max(20, Math.round(cellSize * 0.95));
    walkerEl.style.width = walkerSize + 'px';
    walkerEl.style.height = Math.round(walkerSize * 1.45) + 'px';
    homeEl.style.width = homeSize + 'px';
    homeEl.style.height = Math.round(homeSize * 0.9) + 'px';
  }

  // Position an overlay element at a given grid cell (centered in the cell).
  function placeOverlayAtCell(el, r, c) {
    if (!el) return;
    var left = myCanvas.offsetLeft + (c * cellSize) + (cellSize * 0.5);
    var top  = myCanvas.offsetTop + (r * cellSize) + (cellSize * 0.5);
    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  // Sync the walker (start) and home (goal) markers with current grid state.
  function syncStoryMarkers() {
    ensureOverlayElements();
    updateOverlaySizes();
    placeOverlayAtCell(walkerEl, startRow, startCol);
    placeOverlayAtCell(homeEl, endRow, endCol);
  }

  // Initialize grid arrays and place default start/end points.
  function setupGrid() {
    gridType  = [];
    gridState = [];
    for (var r = 0; r < numRows; r++) {
      gridType.push(new Uint8Array(numCols));
      gridState.push(new Uint8Array(numCols));
    }
    // default start and end positions
    startRow = Math.floor(numRows / 2); startCol = 2;
    endRow   = Math.floor(numRows / 2); endCol   = numCols - 3;
    gridType[startRow][startCol] = START;
    gridType[endRow][endCol]     = END;
    syncStoryMarkers();
  }

  // Draw one cell based on its type (wall/start/end) and state (frontier/visited/path).
  function drawOneCell(r, c, animate) {
    var x = c * cellSize;
    var y = r * cellSize;
    var gt = gridType[r][c];
    var gs = gridState[r][c];

    // pick background color - dark theme
    var bg = '#1a1f2e';
    if      (gt === WALL)  bg = '#14532d';
    else if (gt === START) bg = '#1e1b4b';
    else if (gt === END)   bg = '#450a0a';
    else if (gs === PATH)  bg = '#064e3b';
    else if (gs === VIS)   bg = '#1e3a5f';
    else if (gs === FRONT) bg = '#4a3c0a';

    myCtx.fillStyle = bg;
    myCtx.fillRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);

    // color overlay for frontier with glow
    if (gs === FRONT && gt !== START && gt !== END) {
      // base fill
      myCtx.fillStyle = 'rgba(251,191,36,0.85)';
      myCtx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      // inner glow
      myCtx.fillStyle = 'rgba(251,191,36,0.4)';
      myCtx.fillRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
    }
    // color overlay for visited with pulse effect
    if (gs === VIS && gt !== START && gt !== END) {
      myCtx.fillStyle = 'rgba(59,130,246,0.75)';
      myCtx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      // center highlight
      myCtx.fillStyle = 'rgba(96,165,250,0.5)';
      myCtx.fillRect(x + 4, y + 4, cellSize - 8, cellSize - 8);
    }
    // path with enhanced glow
    if (gs === PATH && gt !== START && gt !== END) {
      myCtx.fillStyle = 'rgba(16,185,129,0.9)';
      myCtx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
      // bright center
      myCtx.fillStyle = 'rgba(52,211,153,0.6)';
      myCtx.fillRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
    }

    // glowing start dot with enhanced effect
    if (gt === START) {
      myCtx.shadowColor = '#a78bfa';
      myCtx.shadowBlur  = cellSize * 0.8;
      myCtx.fillStyle   = '#a78bfa';
      myCtx.beginPath();
      myCtx.arc(x + cellSize/2, y + cellSize/2, cellSize * 0.35, 0, Math.PI * 2);
      myCtx.fill();
      // inner core
      myCtx.shadowBlur = 0;
      myCtx.fillStyle = '#d8b4fe';
      myCtx.beginPath();
      myCtx.arc(x + cellSize/2, y + cellSize/2, cellSize * 0.18, 0, Math.PI * 2);
      myCtx.fill();
    }
    // glowing end dot with enhanced effect
    if (gt === END) {
      myCtx.shadowColor = '#f87171';
      myCtx.shadowBlur  = cellSize * 0.8;
      myCtx.fillStyle   = '#f87171';
      myCtx.beginPath();
      myCtx.arc(x + cellSize/2, y + cellSize/2, cellSize * 0.35, 0, Math.PI * 2);
      myCtx.fill();
      // inner core
      myCtx.shadowBlur = 0;
      myCtx.fillStyle = '#fca5a5';
      myCtx.beginPath();
      myCtx.arc(x + cellSize/2, y + cellSize/2, cellSize * 0.18, 0, Math.PI * 2);
      myCtx.fill();
    }
  }

  // Redraw the full grid from the current gridType/gridState arrays.
  function drawEverything() {
    myCtx.fillStyle = '#0f172a';
    myCtx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    for (var r = 0; r < numRows; r++) {
      for (var c = 0; c < numCols; c++) {
        drawOneCell(r, c, false);
      }
    }
  }

  // Clear algorithm visualization (frontier/visited/path) but keep walls and start/end.
  function clearVisualization() {
    for (var r = 0; r < numRows; r++) {
      for (var c = 0; c < numCols; c++) {
        if (gridState[r][c] !== UNVIS) {
          gridState[r][c] = UNVIS;
          drawOneCell(r, c);
        }
      }
    }
  }

  // Convert mouse coordinates to grid row/col.
  function getCellFromEvent(e) {
    var rect = myCanvas.getBoundingClientRect();
    var scaleX = myCanvas.width  / rect.width;
    var scaleY = myCanvas.height / rect.height;
    var col = Math.floor(((e.clientX - rect.left) * scaleX) / cellSize);
    var row = Math.floor(((e.clientY - rect.top)  * scaleY) / cellSize);
    if (row >= 0 && row < numRows && col >= 0 && col < numCols) {
      return { r: row, c: col };
    }
    return null;
  }

    // Apply the current drawing tool to a cell (wall/erase/start/end).
    function applyDrawTool(cell) {
      if (!cell) return;
    var r = cell.r, c = cell.c;
    var gt = gridType[r][c];

    if (drawTool === 'wall' && gt !== START && gt !== END) {
      gridType[r][c] = WALL;
      drawOneCell(r, c);
    } else if (drawTool === 'erase' && gt !== START && gt !== END) {
      gridType[r][c]  = EMPTY;
      gridState[r][c] = UNVIS;
      drawOneCell(r, c);
    } else if (drawTool === 'start' && gt !== END) {
      gridType[startRow][startCol] = EMPTY;
      drawOneCell(startRow, startCol);
      startRow = r; startCol = c;
      gridType[r][c] = START;
      drawOneCell(r, c);
    } else if (drawTool === 'end' && gt !== START) {
      gridType[endRow][endCol] = EMPTY;
      drawOneCell(endRow, endCol);
      endRow = r; endCol = c;
      gridType[r][c] = END;
      drawOneCell(r, c);
    }
    syncStoryMarkers();
  }

  // Mouse input: click/drag to paint, right-click to erase.
  myCanvas.addEventListener('mousedown', function(e) {
    if (currentProb !== 'maze' || isRunning) return;
    mouseIsDown = true;
    applyDrawTool(getCellFromEvent(e));
  });
  myCanvas.addEventListener('mousemove', function(e) {
    if (!mouseIsDown || currentProb !== 'maze' || isRunning) return;
    applyDrawTool(getCellFromEvent(e));
  });
  myCanvas.addEventListener('mouseup',    function() { mouseIsDown = false; });
  myCanvas.addEventListener('mouseleave', function() { mouseIsDown = false; });
  myCanvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if (currentProb !== 'maze' || isRunning) return;
    var old = drawTool;
    drawTool = 'erase';
    applyDrawTool(getCellFromEvent(e));
    drawTool = old;
  });

  // Return all valid non-wall neighbors (4-directional movement).
  function getNeighbors(r, c) {
    var dirs = [[0,1],[1,0],[0,-1],[-1,0]];
    var result = [];
    dirs.forEach(function(d) {
      var nr = r + d[0], nc = c + d[1];
      if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols && gridType[nr][nc] !== WALL) {
        result.push({ r: nr, c: nc });
      }
    });
    return result;
  }

  // Manhattan distance heuristic for A* (grid with 4-direction moves).
  function manhattanDist(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
  }

  // Trace back the path from end to start using the parent map.
  function buildPath(parentMap, er, ec) {
    var path = [];
    var key  = er + ',' + ec;
    while (key) {
      var parts = key.split(',');
      path.unshift({ r: parseInt(parts[0]), c: parseInt(parts[1]) });
      key = parentMap[key];
    }
    return path;
  }

  // Build the algorithm steps list for animation (A* only).
  // Each step is one of: visit, frontier, path, fail.
  function buildAlgoSteps(algoName) {
    var startKey = startRow + ',' + startCol;
    var endKey   = endRow   + ',' + endCol;
    var steps    = [];
    var parents  = {};
    parents[startKey] = null;

    // A*: priority queue ordered by f = g + h.
    var pq     = [];
    var gCosts = {};
    gCosts[startKey] = 0;
    var visited = new Set();

    pq.push({ r: startRow, c: startCol, f: 0, g: 0 });
    pq.sort(function(a, b) { return a.f - b.f; });

    while (pq.length > 0) {
      var cur = pq.shift();
      var curKey = cur.r + ',' + cur.c;
      if (visited.has(curKey)) continue;
      visited.add(curKey);
      steps.push({ type: 'visit', r: cur.r, c: cur.c });

      if (cur.r === endRow && cur.c === endCol) {
        steps.push({ type: 'path', path: buildPath(parents, endRow, endCol) });
        return steps;
      }

      getNeighbors(cur.r, cur.c).forEach(function(nb) {
        var nk  = nb.r + ',' + nb.c;
        var ng  = cur.g + 1;
        if (gCosts[nk] === undefined || ng < gCosts[nk]) {
          gCosts[nk]  = ng;
          parents[nk] = curKey;
          var h = manhattanDist(nb.r, nb.c, endRow, endCol);
          var fVal = ng + h;
          pq.push({ r: nb.r, c: nb.c, f: fVal, g: ng });
          pq.sort(function(a, b) { return a.f - b.f; });
          steps.push({ type: 'frontier', r: nb.r, c: nb.c });
        }
      });
    }

    steps.push({ type: 'fail' });
    return steps;
  }

    // Generate a random maze using recursive backtracker carving.
    function makeMaze() {
    for (var r = 0; r < numRows; r++) {
      for (var c = 0; c < numCols; c++) {
        if (gridType[r][c] !== START && gridType[r][c] !== END) {
          gridType[r][c] = WALL;
        }
      }
    }

    var visited = new Set();
    var stack   = [{ r: 1, c: 1 }];
    gridType[1][1] = EMPTY;
    visited.add('1,1');

    while (stack.length > 0) {
      var cur = stack[stack.length - 1];
      var neighbors = [[-2,0],[2,0],[0,-2],[0,2]].map(function(d) {
        return { r: cur.r + d[0], c: cur.c + d[1] };
      }).filter(function(n) {
        return n.r > 0 && n.r < numRows-1 && n.c > 0 && n.c < numCols-1 && !visited.has(n.r+','+n.c);
      });

      if (neighbors.length === 0) {
        stack.pop();
        continue;
      }
      var next = neighbors[Math.floor(Math.random() * neighbors.length)];
      var wallR = (cur.r + next.r) / 2;
      var wallC = (cur.c + next.c) / 2;
      gridType[wallR][wallC] = EMPTY;
      gridType[next.r][next.c] = EMPTY;
      visited.add(next.r + ',' + next.c);
      stack.push(next);
    }

    // make sure start and end are open
    gridType[startRow][startCol] = START;
    gridType[endRow][endCol]     = END;
    [-1,0,1].forEach(function(dr) {
      [-1,0,1].forEach(function(dc) {
        var nr = startRow + dr, nc = startCol + dc;
        if (nr >= 0 && nr < numRows && nc >= 0 && nc < numCols) gridType[nr][nc] = EMPTY;
        var nr2 = endRow + dr, nc2 = endCol + dc;
        if (nr2 >= 0 && nr2 < numRows && nc2 >= 0 && nc2 < numCols) gridType[nr2][nc2] = EMPTY;
      });
    });
    gridType[startRow][startCol] = START;
    gridType[endRow][endCol]     = END;
    gridState = [];
    for (var r = 0; r < numRows; r++) gridState.push(new Uint8Array(numCols));
    drawEverything();
    syncStoryMarkers();
  }

  // Build extra toolbar buttons specific to the maze problem.
  function buildExtraButtons() {
    document.getElementById('extra-tools').innerHTML =
      '<button class="btn" onclick="mazeMod.maze()">Maze</button>' +
      '<button class="btn" onclick="mazeMod.randomWalls()">Random</button>';
  }

  // public API
  return {

    setTool: function(t) { drawTool = t; },

    // Resize the grid and reinitialize start/end and walls.
    resizeGrid: function(n) {
      stopEverything();
      numRows = n; numCols = n;
      calcCellSize();
      setupGrid();
      drawEverything();
      syncStoryMarkers();
    },

    // Fill the board with a generated maze layout.
    maze: function() {
      stopEverything();
      clearVisualization();
      makeMaze();
      addLog('Maze generated using recursive backtracker', 'hi');
    },

    // Scatter random walls while keeping start/end intact.
    randomWalls: function() {
      stopEverything();
      clearVisualization();
      for (var r = 0; r < numRows; r++) {
        for (var c = 0; c < numCols; c++) {
          if (gridType[r][c] !== START && gridType[r][c] !== END && Math.random() < 0.30) {
            gridType[r][c] = WALL;
          }
        }
      }
      drawEverything();
      addLog('Random walls placed', 'hi');
    },

    // Initial module setup when maze problem is selected.
    init: function() {
      calcCellSize();
      setupGrid();
      drawEverything();
      buildExtraButtons();
      addLog('Draw walls then click Run', 'hi');
      setColorKey(0, 'Set');
      setColorKey(1, 'Set');
      syncStoryMarkers();
    },

    // Run the selected algorithm and animate the resulting steps.
    run: function() {
      clearVisualization();
      var algo = document.getElementById('algo-sel').value;
      addLog('Running ' + algo + ' from (' + startRow + ',' + startCol + ') to (' + endRow + ',' + endCol + ')', 'hi');
      setPhase('running', algo + ' searching...');
      highlightStep(0);
      ensureOverlayElements();
      if (walkerEl) {
        // Snap the walker back to the start before the animation begins.
        walkerEl.classList.remove('walking');
        placeOverlayAtCell(walkerEl, startRow, startCol);
      }

      var steps = buildAlgoSteps(algo);
      var vc = 0, fc = 0;

      // Animate each step and update stats, logs, and visuals.
      runAnimation(steps, function(step) {
        if (step.type === 'frontier') {
          if (gridType[step.r][step.c] !== START && gridType[step.r][step.c] !== END) {
            gridState[step.r][step.c] = FRONT;
            drawOneCell(step.r, step.c);
          }
          onFrontierNode();
          setPhase('frontier', 'Adding (' + step.r + ',' + step.c + ') to frontier');
          highlightStep(0);
          playFrontierSound();

        } else if (step.type === 'visit') {
          if (gridType[step.r][step.c] !== START && gridType[step.r][step.c] !== END) {
            gridState[step.r][step.c] = VIS;
            drawOneCell(step.r, step.c);
          }
          onVisitedNode();
          setPhase('visited', 'Visiting (' + step.r + ',' + step.c + ')');
          highlightStep(1);
          if (visitedCount % 15 === 0) playStepSound();

        } else if (step.type === 'path') {
          highlightStep(2);
          var pathCells = step.path;
          if (walkerEl) walkerEl.classList.add('walking');
          pathCells.forEach(function(p, i) {
            var t = setTimeout(function() {
              if (gridType[p.r][p.c] !== START && gridType[p.r][p.c] !== END) {
                gridState[p.r][p.c] = PATH;
                drawOneCell(p.r, p.c);
              }
              // Move the walker to the next cell in the final path.
              placeOverlayAtCell(walkerEl, p.r, p.c);
              if (i === pathCells.length - 1) {
                onPathFound(pathCells.length + ' steps');
                setPhase('done', 'Path found! ' + pathCells.length + ' steps, visited ' + visitedCount);
                addLog('PATH FOUND - ' + pathCells.length + ' steps, visited ' + visitedCount + ' nodes', 'ok');
                if (walkerEl) walkerEl.classList.remove('walking');
                playSuccessSound();
                myCanvas.classList.add('canvas-success');
                setTimeout(function() {
                  myCanvas.classList.remove('canvas-success');
                }, 3000);
              }
            }, i * 16);
            allTimers.push(t);
          });

        } else if (step.type === 'fail') {
          onPathFound('No path');
          setPhase('error', 'No path - walls block all routes');
          addLog('No path found', 'err');
          if (walkerEl) walkerEl.classList.remove('walking');
          playFailSound();
        }
      });
    },

    reset: function() {
      clearVisualization();
      drawEverything();
      syncStoryMarkers();
    },
    clear: function() {
      setupGrid();
      drawEverything();
      syncStoryMarkers();
    },
  };

})();
