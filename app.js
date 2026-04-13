// app.js
// main controller - builds sidebar, handles switching between problems
// ties everything together
// done by Ratandeep Singh

// build the sidebar from problemList
function buildSidebar() {
  var sb = document.getElementById('sidebar');
  
  // Preserve the problem-info-section
  var problemInfoSection = sb.querySelector('.problem-info-section');
  
  sb.innerHTML = '';

  // group problems by unit
  var groups = { 1: [], 2: [], 3: [] };
  Object.keys(problemList).forEach(function(key) {
    var u = problemList[key].unit;
    groups[u].push(key);
  });

  [1, 2, 3].forEach(function(u) {
    if (groups[u].length === 0) return; // skip empty units

    groups[u].forEach(function(key) {
      var p = problemList[key];
      var btn = document.createElement('button');
      btn.className = 'sb-btn' + (key === currentProb ? ' active' : '');
      btn.id = 'sb-' + key;
      btn.onclick = function() { switchProblem(key); };
      btn.innerHTML =
        '<div class="sb-icon">' + p.icon + '</div>' +
        '<div class="sb-meta">' +
          '<div class="sb-name">' + p.label + '</div>' +
          '<div class="sb-tag">'  + p.tag   + '</div>' +
        '</div>';
      sb.appendChild(btn);
    });
  });
  
  // Re-add the problem-info-section at the end
  if (problemInfoSection) {
    sb.appendChild(problemInfoSection);
  }
}

// switch to a different problem
function switchProblem(key) {
  stopEverything();
  clearLog();
  resetStepCount();
  resetAllStats();
  resetStepHighlight();
  setPhase('ready', 'Select an algorithm and click Run');

  // update sidebar active state
  document.querySelectorAll('.sb-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  var btn = document.getElementById('sb-' + key);
  if (btn) btn.classList.add('active');

  currentProb = key;
  document.getElementById('tb-title').textContent = problemList[key].label;

  // populate algo dropdown
  var sel = document.getElementById('algo-sel');
  sel.innerHTML = problemAlgos[key].map(function(a) {
    return '<option value="' + a + '">' + a + '</option>';
  }).join('');

  // clear extra toolbar buttons
  document.getElementById('extra-tools').innerHTML = '';

  updateInfoPanel();

  // init the problem module
  var mod = allModules[key];
  if (mod && mod.init) mod.init();
}

// when user picks a different algorithm
function onAlgoChange() {
  updateInfoPanel();
  stopEverything();
  var mod = allModules[currentProb];
  if (mod && mod.reset) mod.reset();
}

// refresh the right info panel
function updateInfoPanel() {
  var algo = document.getElementById('algo-sel').value;
  var info = algoInfo[algo];
  if (!info) return;

  // algo card
  var optTag   = info.isOptimal  ? '<span class="tag g">Optimal &#10003;</span>'   : '<span class="tag r">Not Optimal</span>';
  var compTag  = info.isComplete ? '<span class="tag g">Complete &#10003;</span>'  : '<span class="tag r">Incomplete</span>';
  document.getElementById('algo-mount').innerHTML =
    '<div class="acard">' +
      '<div class="acard-name" style="color:' + info.color + '">' + info.name + '</div>' +
      '<div class="acard-desc">' + info.desc + '</div>' +
      '<div class="tags">' +
        '<span class="tag y">Time: ' + info.tc + '</span>' +
        '<span class="tag b">Space: ' + info.sc + '</span>' +
        optTag + compTag +
      '</div>' +
    '</div>';

  // step by step explanation
  var steps = algoStepsList[algo] || [];
  document.getElementById('algo-steps').innerHTML = steps.map(function(s, i) {
    return '<div class="algo-step"><span class="step-num">' + (i+1) + '</span>' + s + '</div>';
  }).join('');

  // problem description
  document.getElementById('prob-mount').innerHTML =
    '<div class="acard" style="background:var(--s3);border-color:rgba(108,99,255,.15)">' +
      '<div style="font-size:10px;color:var(--mut);line-height:1.7">' + problemDesc[currentProb] + '</div>' +
    '</div>';

  // edit inputs panel
  buildEditPanel(currentProb);
}

// build the editable inputs section per problem
function buildEditPanel(prob) {
  var m = document.getElementById('edit-mount');

  if (prob === 'maze') {
    m.innerHTML =
      '<div class="edit-panel">' +
        '<div class="edit-row"><span class="edit-lbl">Draw mode</span>' +
          '<select class="edit-inp" style="width:auto" id="draw-tool" onchange="mazeMod.setTool(this.value)">' +
            '<option value="wall">Wall</option>' +
            '<option value="erase">Erase</option>' +
            '<option value="start">Start</option>' +
            '<option value="end">End</option>' +
          '</select>' +
        '</div>' +
      '</div>';

  } else {
    m.innerHTML =
      '<div class="edit-panel">' +
        '<div style="font:400 9px var(--mono);color:var(--mut)">Controls appear in toolbar above.</div>' +
      '</div>';
  }
}

// toolbar button handlers
function doRun() {
  if (isRunning) return;
  resetStepCount();
  resetAllStats();
  resetStepHighlight();
  clearLog();
  var mod = allModules[currentProb];
  if (mod && mod.run) mod.run();
}
function doReset() {
  stopEverything();
  resetStepCount();
  resetAllStats();
  resetStepHighlight();
  setPhase('ready', 'Cleared');
  var mod = allModules[currentProb];
  if (mod && mod.reset) mod.reset();
}
function doClear() {
  stopEverything();
  resetStepCount();
  resetAllStats();
  resetStepHighlight();
  clearLog();
  setPhase('ready', 'Select an algorithm and click Run');
  var mod = allModules[currentProb];
  if (mod && mod.clear) mod.clear();
}

// map of all modules - each module file sets these globals
var allModules = {};

// boot everything when page loads
window.addEventListener('DOMContentLoaded', function() {
  // register all modules
  allModules = {
    maze:         mazeMod,
  };

  buildSidebar();
  switchProblem('maze');

  // unlock audio on first click (browser requires user gesture)
  document.addEventListener('click', function() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });
});

// resize canvas when window resizes
window.addEventListener('resize', function() {
  var mod = allModules[currentProb];
  if (mod && mod.init) mod.init();
});
