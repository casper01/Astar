function removeFromArray(arr, elt) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);
        }
    }
}

function heuristics(elt, dest) {
    return dist(elt.i, elt.j, dest.i, dest.j);
}


var cols = 25;
var rows = 25;
var wallProb = 0.3;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.prev = undefined;
    this.wall = false;

    this.show = function (col) {
        fill(col);
        noStroke();
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    this.addNeighbors = function (grid) {
        var i = this.i;
        var j = this.j;

        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (i > 0 && j > 0) {
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if (i > 0 && j < rows - 1) {
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < cols - 1 && j > 0) {
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i < cols - 1 && j < rows - 1) {
            this.neighbors.push(grid[i + 1][j + 1]);
        }
    }
}

function setup() {
    createCanvas(600, 400);
    w = width / cols;
    h = height / rows;

    // Making a 2D Array
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
            
            if (random(1) < wallProb) {
                grid[i][j].wall = true;
            }
        }
    }
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][rows - 1];
    openSet.push(start);
    start.wall = false;
    end.wall = false;
}

function draw() {
    background(0);

    if (openSet.length > 0) {
        var winner = 0;
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }
        var current = openSet[winner];

        if (current === end) {
            console.log("DONE");
            noLoop();
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            if (closedSet.includes(neighbor) || neighbor.wall) {
                continue;
            }

            var tempG = current.g + 1;
            var tempIsBetter = false;

            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
                neighbor.y = heuristics(neighbor, end);
                tempIsBetter = true;
            }
            else if (tempG < neighbor.g) {
                tempIsBetter = true;
            }

            if (tempIsBetter) {
                neighbor.prev = current;
                neighbor.g = tempG;
                neighbor.f = neighbor.g + neighbor.h;
            }
        }
    }
    else {
        // no solution
        console.log("NO SOLUTION");
        noLoop();
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
                grid[i][j].show(color(255));
        }
    }

    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
                if (grid[i][j].wall) {
                    grid[i][j].show(color(0));
                }
        }
    }

    var tempEl = current;
    while (tempEl != undefined) {
        tempEl.show(color(0, 0, 255));
        tempEl = tempEl.prev;
    }
}