var drag, overlay, transformsEle, refTransEle, canvasOverlay, spotlight, canvas, ctx, imgScale, state, spaceHeld;
var inPoints = [];
var outPoints = [];
var transforms = [];
var MAXWIDTH = 490;


// ************************** MATH **************************

function relCoords(event, ele){
  var rect = ele.getBoundingClientRect();
  return {x: event.clientX - rect.left, y: event.clientY - rect.top};
}

function affineFactory(a, b, c, d, e, f, w) {
  var r = function(p) {
    return {x: a*p.x + b*p.y + e, y: c*p.x + d*p.y + f};
  };
  r.a = a;
  r.b = b;
  r.c = c;
  r.d = d;
  r.e = e;
  r.f = f;
  if(typeof w == "undefined") {
    r.w = 1;
  }
  else {
    r.w = w;
  }
  return r;
}


/* logic:
x'   a b   x      e
y' = c d   y    + f


x' = ax + by + e
y' = cx + dy + f

given 3 x,y -> x',y' pairs, can solve for a,b,c,d,e,f
first computation solves for a, b, e, second for c, d, f.
*/
function makeTransform(inPoints, outPoints) {
  var A = [ [inPoints[0].x, inPoints[0].y, 1],
            [inPoints[1].x, inPoints[1].y, 1],
            [inPoints[2].x, inPoints[2].y, 1] ];
  var B1 = [ outPoints[0].x, outPoints[1].x, outPoints[2].x ];
  var B2 = [ outPoints[0].y, outPoints[1].y, outPoints[2].y ];
  
  var X1 = numeric.solve(A, B1);
  var X2 = numeric.solve(A, B2);
  
  return affineFactory(X1[0], X1[1], X2[0], X2[1], X1[2], X2[2]);
}

function transform(p) {
  //var ind = Math.floor(Math.random() * transforms.length);
  var weightsum = 0;
  for(var i=0; i<transforms.length; ++i) { //todo move elsewhere
    weightsum += transforms[i].w;
  }
  var r = Math.random(), ind = 0;
  for(var i=0; i<transforms.length; ++i) {
    if(r < transforms[i].w/weightsum) {
      ind = i;
      break;
    }
    r -= transforms[i].w/weightsum;
  }
  return transforms[ind](p);
}


// ************************** DRAWING **************************



function highlight(p) {
  spotlight.style.left = (p.x+2-10/2) + 'px';
  spotlight.style.top = (p.y+2-10/2) + 'px';
}

function drawPoint(p) {
  ctx.fillRect(p.x, p.y, 1, 1);
}


var SPEED = 20;
var SKIP = 100;
var DELAY = 1;
var point;

function draw() {
  if(typeof point == 'undefined') {
    point = {x: Math.random() * canvas.width, y: Math.random() * canvas.height};
    for(var i=0; i<SKIP; ++i) {
      point = transform(point);
    }
  }
  
  for(var i=0; i<SPEED; ++i) {
    point = transform(point);
    drawPoint(point);
  }
  
  if(!spaceHeld) return;
  
  setTimeout(draw, DELAY);
}


function clear() {
  canvas.width = canvas.width;
}


function reset() {
  while(transformsEle.firstChild) {
    transformsEle.removeChild(transformsEle.firstChild);
  }
  addTransform();
  

  canvas.width = canvas.height = 500; // also clears
  canvasOverlay.style.width = (canvas.width + 4) + 'px';
  canvasOverlay.style.height = (canvas.height) + 4 + 'px';
  state = 'I1';
  inPoints = [];
  outPoints = [];
  transforms = [];
}


function advance(p) {
  switch (state) {
    case 'I1':
      inPoints[0] = p;
      ctx.strokeStyle = 'rgb(200,0,0)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,2,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      state = 'I2';
      break;
    case 'I2':
      inPoints[1] = p;
      ctx.strokeStyle = 'rgb(0,200,0)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,2,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      state = 'I3';
      break;
    case 'I3':
      inPoints[2] = p;
      ctx.strokeStyle = 'rgb(0,0,200)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,2,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      state = 'O1';
      break;
    case 'O1':
      outPoints[0] = p;
      ctx.strokeStyle = 'rgba(255,0,0,0.5)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,1.5,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      state = 'O2';
      break;
    case 'O2':
      outPoints[1] = p;
      ctx.strokeStyle = 'rgba(0,255,0,0.5)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,1.5,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      state = 'O3';
      break;
    case 'O3':
      outPoints[2] = p;
      ctx.strokeStyle = 'rgba(0,0,255,0.5)';
      ctx.beginPath();
      ctx.arc(p.x,p.y,1.5,0,2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      transforms.push(makeTransform(inPoints, outPoints));
      outPoints = [];
      updateTransEles();
      state = 'O1';
      break;
    case 'Done':
      break;
    default: 
      alert('wat');
  }
}



// ************************** UI **************************

function dragEnter(e) {
  e.stopPropagation();
  e.preventDefault();
  
  overlay.style.display = 'block';
}

function dragOver(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragLeave(e) {
  overlay.style.display = 'none';
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  drag.reset();
  overlay.style.display = 'none';
  
  processFiles(e.dataTransfer.files);
}

function click(e) {
  var p = relCoords(e, canvas);
  highlight(p);
  advance(p);
}

function keyDown(e) {
  switch (e.which) {
    case 32: // space
      spaceHeld = true;
      e.preventDefault();
      draw();
      break;
    case 67: // c
      clear();
      break;
    case 82: // r
      reset()
      break;
    case 85: // u; backspace = 8
      e.preventDefault();
      break;
  }
}

function keyUp(e) {
  if (e.which == 32) {
    spaceHeld = false;
    e.preventDefault();
  }
}


function processFiles(files) {
  if(files.length != 1) { // todo errors
    return;
  }
  if (!files[0].type.match(/image.*/)) { // todo errors
    return;
  }

  // thanks http://stackoverflow.com/a/10209693/1644272
  // https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications#Selecting_files_using_drag_and_drop
  var img = new Image();
  var src = URL.createObjectURL(files[0]);
  img.src = src;
  img.onload = function(){
    reset();
    imgScale = Math.min(img.width, MAXWIDTH) / img.width;
    canvas.width = img.width * imgScale + 10;
    canvas.height = img.height * imgScale + 10;
    canvasOverlay.style.width = (canvas.width + 4) + 'px';
    canvasOverlay.style.height = (canvas.height) + 4 + 'px';
    console.log(canvasOverlay.width)
    ctx.globalAlpha = 0.2;
    ctx.drawImage(img, 5, 5, img.width * imgScale, img.height * imgScale);
    ctx.globalAlpha = 1;
    URL.revokeObjectURL(src);
  }
}



function addTransform(button) {
  var before = null;
  if(button) {
    before = button.parentElement.nextSibling;
  }
  transformsEle.insertBefore(refTransEle.firstElementChild.cloneNode(true), before);
}

function removeTransform(button) {
  if(button) {
    transformsEle.removeChild(button.parentElement);
  }
  else {
    transformsEle.removeChild(transformsEle.lastElementChild);
  }
  updateTransVar();
}


// ************************** UI UPDATES **************************

function updateTransVar() {
  state = 'I1';
  inPoints = [];
  outPoints = [];
  transforms = [];
  for(var i=0; i<transformsEle.childElementCount; ++i) {
    var t = transformsEle.children[i];
    var a = parseFloat(t.querySelector('.a').value);
    var b = parseFloat(t.querySelector('.b').value);
    var c = parseFloat(t.querySelector('.c').value);
    var d = parseFloat(t.querySelector('.d').value);
    var e = parseFloat(t.querySelector('.e').value);
    var f = parseFloat(t.querySelector('.f').value);
    var w = parseFloat(t.querySelector('.w').value);
    transforms.push(affineFactory(a, b, c, d, e, f, w));
  }

}

function updateTransEles() {
  while(transformsEle.childElementCount > transforms.length) {
    removeTransform();
  }
  while(transformsEle.childElementCount < transforms.length) {
    addTransform();
  }
  
  for(var i=0; i<transforms.length; ++i) {
    var t = transformsEle.children[i];
    t.querySelector('.a').value = transforms[i].a;
    t.querySelector('.b').value = transforms[i].b;
    t.querySelector('.c').value = transforms[i].c;
    t.querySelector('.d').value = transforms[i].d;
    t.querySelector('.e').value = transforms[i].e;
    t.querySelector('.f').value = transforms[i].f;
    t.querySelector('.w').value = transforms[i].w;
  }

}


function transEleChange(e) {
  updateTransVar();
}

function transEleKeypress(e) {
    if (e.which == 13) { // enter
      e.stopPropagation();
      document.activeElement.blur();
      updateTransVar();
    }
}



// ************************** LAUNCH **************************


function launch() {
  drag = new Dragster(document.body);
  overlay = document.getElementById('overlay');
  transformsEle = document.getElementById("transforms");
  refTransEle = document.querySelector(".reference-transform");
  canvasOverlay = document.getElementById('can-overlay');
  spotlight = document.getElementById('spotlight');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  console.log('load');
  
  document.body.addEventListener('dragster:enter', dragEnter);
  document.body.addEventListener('dragover', dragOver);
  document.body.addEventListener('dragster:leave', dragLeave);
  document.body.addEventListener('drop', drop);
  
  addEventListener('keydown', keyDown);
  addEventListener('keyup', keyUp);
  
  canvas.addEventListener('click', click);
  
  transformsEle.addEventListener('change', transEleChange);
  transformsEle.addEventListener('keypress', transEleKeypress);
  
  reset();
}

window.addEventListener('load', launch, false);
