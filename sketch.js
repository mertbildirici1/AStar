// Function to delete element from the array
function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

// An educated guess of how far it is between two points
function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}

// How many columns and rows?
var cols = 100;
var rows = 100;

// This will be the 2D array
var grid = new Array(cols);

// Open and closed set
var openSet = [];
var closedSet = [];

// Start and end
var start;
var end;

// Width and height of each cell of grid
var w, h;

// The road taken
var path = [];

var userClicked = false; // Flag to check if user has clicked

function setup() {
    createCanvas(800, 800);
    randomSeed(3);
    console.log('A*');
  
    // Grid cell size
    w = width / cols;
    h = height / rows;
  
    // Making a 2D array
    for (var i = 0; i < cols; i++) {
      grid[i] = new Array(rows);
    }
  
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  
    // All the neighbors
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        grid[i][j].addNeighbors(grid);
      }
    }
  
    // Start point
    start = grid[0][0];
    start.wall = false;
    start.start = true; // Set the start point flag
  
    // openSet starts with beginning only
    openSet.push(start);
    background(45, 197, 244);
  
    noLoop(); // Stop draw loop until user clicks
  
    // Display instruction
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text('Click somewhere on the map to set the endpoint', width / 2, height / 2); // Instruction text
}
  

function draw() {
  // Check if user has set the endpoint
  if (!userClicked) {
    return;
  }

  // Am I still searching?
  if (openSet.length > 0) {

    // Best next option
    var winner = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[winner].f) {
        winner = i;
      }
    }
    var current = openSet[winner];

    // Did I finish?
    if (current === end) {
      noLoop();
      console.log("DONE!");
      // Display message and circle the endpoint
      fill(0);
      textSize(24);
      textAlign(CENTER);
      text('Endpoint Found!', width / 2, height - 40);

      stroke(0);
      strokeWeight(4);
      noFill();
      ellipse(end.i * w + w / 2, end.j * h + h / 2, w, h);
    }

    // Best option moves from openSet to closedSet
    removeFromArray(openSet, current);
    closedSet.push(current);

    // Check all the neighbors
    var neighbors = current.neighbors;
    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];

      // Valid next spot?
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        var tempG = current.g + heuristic(neighbor, current);

        // Is this a better path than before?
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        // Yes, it's a better path
        if (newPath) {
          neighbor.h = heuristic(neighbor, end);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }
      }

    }
  } else {
    console.log('no solution');
    noLoop();
    return;
  }

  // Draw current state of everything
  background(45, 197, 244, 1);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }

  for (var i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(236, 1, 90, 3));
  }

  for (var i = 0; i < openSet.length; i++) {
    openSet[i].show(color(240, 99, 164, 3));
  }

  // Find the path by working backwards
  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (var i = 0; i < path.length; i++) {
    // path[i].show(color(45, 197, 244));
  }

  // Drawing path as continuous line
  noFill();
  stroke(252, 238, 33);
  strokeWeight(w / 2);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
  endShape();
}

function mousePressed() {
  if (!userClicked) {
    var i = floor(mouseX / w);
    var j = floor(mouseY / h);
    end = grid[i][j];
    end.wall = false;
    userClicked = true;
    // Redraw the background to clear instruction text
    background(45, 197, 244);
    loop(); // Start the draw loop
  }
}
