var TIMEPERSTEP = 1000;

function debug() {
  var o = '{\n' + 
          '  inPoints: [' + inPoints.map(function(p){return '{x: ' + p.x + ', y: ' + p.y + '}';}).join(', ') + '],\n' +
          '  outPoints: [' + outPoints.join(', ') + '],\n' +
          '  weights: [';
  o += transforms[0].w
  for(var i=1; i<transforms.length; ++i) {
    o += ', ' + transforms[i].w;
  }
  o += ']\n}';
  console.log(o);
}


var examples = [
  {
    id: 'triangle',
    name: 'Sierpinski triangle',
    bg: 'Sierpinski triangle.png',
    description: 'Probably the most ubiquitous fractal. Occasionally when people talk about the "chaos game", they\'re referring specifically to this method of generating the Sierpinski triangle.',
    inPoints: [ {x: 10, y: 445}, {x: 251, y: 27}, {x: 492, y: 445} ],
    outPoints: [
      [ {x: 10, y: 445}, {x: 130, y: 236}, {x: 251, y: 445} ], 
      [ {x: 130, y: 236}, {x: 251, y: 27}, {x: 371, y: 236} ],
      [ {x: 251, y: 445}, {x: 371, y: 236}, {x: 492, y: 445} ]
    ],
    weights: [1, 1, 1]
  },
  {
    id: 'fern',
    name: 'Barsley Fern',
    bg: 'barnsley.gif',
    description: 'One of the first IFS\'s, or rather a slight modification thereof. This also demonstrates the occasional necessity of setting weights: if you don\'t, this will look a lot less natural.',
    inPoints: [ {x: 20, y: 350}, {x: 294, y: 403}, {x: 272, y: 22} ],
    outPoints: [
      [ {x: 147, y: 565}, {x: 147, y: 565}, {x: 147, y: 501} ],
      [ {x: 46, y: 294}, {x: 279, y: 345}, {x: 272, y: 22} ],
      [ {x: 60, y: 481}, {x: 126, y: 427}, {x: 20, y: 350} ],
      [ {x: 236, y: 543}, {x: 181, y: 484}, {x: 294, y: 403} ]
    ],
    weights: [1, 85, 7, 7]
  },
  {
    id: 'dragon_full',
    name: 'Dragon curve',
    bg: 'dragon color.png',
    description: 'The Dragon curve is self-similar, although it can be hard to see precisely how without some helpful coloring.',
    inPoints: [ {x: 114, y: 217}, {x: 270, y: 63}, {x: 425, y: 217} ],
    outPoints: [
      [ {x: 114, y: 217}, {x: 114, y: 63}, {x: 270, y: 63} ],
      [ {x: 425, y: 217}, {x: 270, y: 217}, {x: 270, y: 63} ]
    ],
    weights: [1, 1]
  },
  {
    id: 'pythag_tree',
    name: 'Pythagorean tree',
    bg: 'PythagorasTree.png',
    description: 'The tree itself is not self-similar, but its leaves are. In fact, the boundary is the Lévy C curve, the Wikipedia article for which might give you a clue to another way of getting the same IFS.',
    inPoints: [ {x: 210, y: 329}, {x: 210, y: 248}, {x: 291, y: 248} ],
    outPoints: [
      [ {x: 210, y: 248}, {x: 169, y: 208}, {x: 210, y: 167} ], 
      [ {x: 291, y: 248}, {x: 331, y: 208}, {x: 291, y: 167} ]
    ],
    weights: [1, 1]
  },
  {
    id: 'hexaflake',
    name: 'Hexaflake',
    bg: 'hexaflake.png',
    description: 'One of an entire family of <em>n</em>-flakes. Conceptually similar to Sierpinski\'s triangle.',
    inPoints: [ {x: 241, y: 276}, {x: 92, y: 189}, {x: 390, y: 190} ],
    outPoints: [
      [ {x: 92, y: 189}, {x: 42, y: 161}, {x: 142, y: 161} ], 
      [ {x: 241, y: 103}, {x: 191, y: 74}, {x: 291, y: 74} ], 
      [ {x: 390, y: 190}, {x: 340, y: 161}, {x: 440, y: 161} ], 
      [ {x: 390, y: 362}, {x: 340, y: 333}, {x: 440, y: 333} ], 
      [ {x: 241, y: 449}, {x: 191, y: 420}, {x: 291, y: 420} ], 
      [ {x: 92, y: 362}, {x: 42, y: 333}, {x: 142, y: 333} ],
      [ {x: 241, y: 276}, {x: 191, y: 247}, {x: 291, y: 247} ]
    ],
    weights: [1, 1, 1, 1, 1, 1]
  },
  {
    id: 'carpet',
    name: 'Sierpinksi carpet',
    bg: 'Sierpinski_carpet.png',
    description: 'Another variant on Sierpinski\'s triangle. There is also a 3D version, often called the Menger sponge. This technique will also create figures in 3D, but it\'s harder to see them properly.',
    inPoints: [ {x: 169, y: 331}, {x: 169, y: 169}, {x: 331, y: 169} ],
    outPoints: [
      [ {x: 59, y: 113}, {x: 59, y: 59}, {x: 113, y: 59} ], 
      [ {x: 223, y: 113}, {x: 223, y: 59}, {x: 277, y: 59} ], 
      [ {x: 387, y: 113}, {x: 387, y: 59}, {x: 441, y: 59} ], 
      [ {x: 387, y: 277}, {x: 387, y: 223}, {x: 441, y: 223} ], 
      [ {x: 387, y: 441}, {x: 387, y: 387}, {x: 441, y: 387} ], 
      [ {x: 223, y: 441}, {x: 223, y: 387}, {x: 277, y: 387} ], 
      [ {x: 59, y: 441}, {x: 59, y: 387}, {x: 113, y: 387} ], 
      [ {x: 59, y: 277}, {x: 59, y: 223}, {x: 113, y: 223} ]
    ],
    weights: [1, 1, 1, 1, 1, 1, 1, 1]
  },
  {
    id: 'koch',
    name: 'Koch curve',
    bg: 'koch.png',
    description: 'One edge of the Koch snowflake.',
    inPoints: [ {x: 27, y: 206}, {x: 251, y: 77}, {x: 474, y: 206} ],
    outPoints: [
      [ {x: 27, y: 206}, {x: 178, y: 206}, {x: 251, y: 77} ], 
      [ {x: 251, y: 77}, {x: 325, y: 206}, {x: 474, y: 206} ]
    ],
    weights: [1, 1]
  },
  {
    id: 'koch85',
    name: 'Koch curve mutant',
    bg: 'Koch_Curve_85degrees.png',
    description: 'A variant on the Koch curve above. I\'m not going to walk you through this one: can you do it for yourself?'
  }
];

var exampleIndices = {
  triangle: 0,
  fern: 1,
  dragon_full: 2,
  pythag_tree: 3,
  hexaflake: 4,
  carpet: 5,
  koch: 6,
  koch85: 7
};

function highlightPoint(p) {
  if(p) {
    spotlight.style.left = (p.x+2-10/2) + 'px';
    spotlight.style.top = (p.y+2-10/2) + 'px';
  }
  else {
    spotlight.style.left = '-20px';
    spotlight.style.top = '-20px';
  }
}



function highlightInstr(ind) {
// todo
  var instructions = document.querySelector('ol').children;
  for(var i=0; i<instructions.length; ++i) {
    instructions[i].style.zIndex = '';
  }
  
  if(typeof ind != 'undefined') {
    instructions[ind].style.zIndex = '101';
  }
}

// ok, the naming here is bad, but I wanted to keep symmetry.
function highlightWeights(ifTrueThenShow) {
  var weights = document.querySelectorAll('.w');
  for(var i=0; i<weights.length; ++i) {
    weights[i].style.zIndex = ifTrueThenShow?'101':'';
  }
}


function unhighlightThen(callback, time) {
  setTimeout(function() {
    highlightPoint();
    setTimeout(callback, TIMEPERSTEP/5);
  }, time);
}

function stepOne(exObj, inPInd) {
  if(inPInd == exObj.inPoints.length) {
    setTimeout(function(){stepTwo(exObj, 0, 0);}, TIMEPERSTEP/2);
    return;
  }
  highlightInstr(1);
  
  var p = exObj.inPoints[inPInd];
  highlightPoint(p);
  advance(p);

  unhighlightThen(function(){stepOne(exObj, inPInd+1);}, TIMEPERSTEP/2);
}

function stepTwo(exObj, outPInd, outPSubInd) {
  if(outPInd == exObj.outPoints.length) {
    setTimeout(function(){stepThree(exObj);}, TIMEPERSTEP/2);
    return;
  }
  highlightInstr(2);
  
  var p = exObj.outPoints[outPInd][outPSubInd];
  highlightPoint(p);
  advance(p);
  
  if(outPSubInd == exObj.outPoints[outPInd].length - 1) {
    unhighlightThen(function(){stepTwo(exObj, outPInd+1, 0);}, TIMEPERSTEP*3/4);
  }
  else {
    unhighlightThen(function(){stepTwo(exObj, outPInd, outPSubInd+1);}, TIMEPERSTEP/2);
  }
  
}

function stepThree(exObj) {
  highlightWeights(true);
  for(var i=0; i<exObj.weights.length; ++i) {
    transformsEle.children[i].querySelector('.w').value = exObj.weights[i];
    transforms[i].w = exObj.weights[i];
  }
  highlightInstr(3);

  setTimeout(function(){stepFour(exObj);}, TIMEPERSTEP*3/2);
}

function stepFour(exObj) {
  highlightWeights();
  highlightInstr(4);
  spaceHeld = true;
  draw();
  setTimeout(stepDone, 4000);
}

function stepDone() {
  spaceHeld = false;
  highlightInstr();
  canvasOverlay.style.display = 'none';
  document.getElementById('ex-overlay').style.display = 'none';
}

function runExample(id) {
  var exObj = examples[exampleIndices[id]];
  reset();
  
  if(exObj.inPoints) {
    canvasOverlay.style.display = 'block';
    document.getElementById('ex-overlay').style.display = 'block';
    highlightInstr(0);
    var callback = function(){
      setTimeout(function(){stepOne(exObj, 0);}, TIMEPERSTEP);
    }
  }
  else {
    var callback = stepDone;
  }

  if(exObj.bg) {
    loadImg('images/' + exObj.bg, callback);
  }
  else {
    callback();
  }
}





function makeExamples() {
  var exEle = document.getElementById('examples');
  var refExEle = document.querySelector('.reference-example');
  for(var i=0; i<examples.length; ++i) {
    var ex = refExEle.cloneNode(true);
    ex.className = '';
    var link = ex.querySelector('.ex-name');
    link.href = '#' + examples[i].id;
    link.text = examples[i].name;
    link.addEventListener('click', (function(id){return function(){runExample(id);};})(examples[i].id));
    ex.querySelector('.ex-desc').innerHTML = examples[i].description;
    exEle.appendChild(ex);
  }
}