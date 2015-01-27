/**
 * grid.js
 * Tests for hex.grid.js functionality.
 */

module("grid");

test("hex.grid()", function() {
  
  expect(3);
  
  // Basic availability
  ok(hex.grid, "hex.grid");
  
  // Throws when missing required fields
  throwing(function() {
    hex.grid();
  }, "no DOM element supplied", "hex.grid()");
  
  // Throws when bad options are passed
  throwing(function() {
    hex.grid( { nodeType: 1 }, { type: "nosuchtype" } );
  }, "hex.grid.nosuchtype does not exist", "hex.grid(type:nosuchtype)");
  
});

test("grid.reorient()", function() {
  expect(0);
  // TODO: Add tests!
});

// Add markers and other DOM goodies to grids
function setupGrid( grid ) {
  
  // Element to show the previously hovered tile
  var prev = document.createElement("div");
  prev.style.textAlign = "center";
  prev.style.lineHeight = grid.tileHeight + "px";
  prev.style.position = "absolute";
  prev.style.border = "4px outset yellow";
  prev.style.width = (grid.tileWidth - 7) + "px";
  prev.style.height = (grid.tileHeight - 7) + "px";
  prev.style.display = "none";
  grid.root.appendChild(prev);
  
  // Element to show the currently hovered tile
  var curr = document.createElement("div");
  curr.style.textAlign = "center";
  curr.style.lineHeight = grid.tileHeight + "px";
  curr.style.position = "absolute";
  curr.style.border = "4px outset green";
  curr.style.width = (grid.tileWidth - 7) + "px";
  curr.style.height = (grid.tileHeight - 7) + "px";
  curr.style.display = "none";
  grid.root.appendChild(curr);
  
  // Extra element to mark the origin
  var marker = document.createElement("div");
  marker.style.lineHeight = "0px";
  marker.style.position = "absolute";
  marker.style.border = "5px ridge red";
  marker.style.height = "0px";
  marker.style.width = "0px";
  marker.style.left = "-5px";
  marker.style.top = "-5px";
  grid.root.appendChild(marker);
  
  // Setting mouse movement related tile events
  grid.addEvent("tileover", function(e, x, y) {
    hex.log([x, y], e.type);
    var inv = grid.screenpos(x, y);
    curr.style.left = inv.x + "px";
    curr.style.top = inv.y + "px";
    curr.innerHTML = [x, y] + '';
  });
  grid.addEvent("tileout", function(e, x, y) {
    hex.log([x, y], e.type);
    var inv = grid.screenpos(x, y);
    prev.style.left = inv.x + "px";
    prev.style.top = inv.y + "px";
    prev.innerHTML = [x, y] + '';
  });
  
  // Setting mouse button related tile events
  grid.addEvent("tiledown", function(e, x, y) {
    hex.log([x, y], e.type);
    curr.style.borderStyle = "inset";
  });
  grid.addEvent("tileup", function(e, x, y) {
    hex.log([x, y], e.type);
    curr.style.borderStyle = "outset";
  });
  grid.addEvent("tileclick", function(e, x, y) {
    hex.log([x, y], e.type);
  });
  grid.addEvent("tiletap", function(e, x, y) {
    hex.log([x, y], e.type);
  });
  
  // Setting mouse movement related grid events
  grid.addEvent("gridover", function(e, x, y) {
    hex.log([x, y], e.type);
    curr.style.display = "";
    prev.style.display = "";
  });
  grid.addEvent("gridout", function(e, x, y) {
    hex.log([x, y], e.type);
    curr.style.display = "none";
    prev.style.display = "none";
  });
  
  // Center the root element.
  var size = hex.size(grid.elem);
  grid.reorient(size.x * 0.5, size.y * 0.5);
  
}

test("hex.grid(hexagonal)", function() {
  
  expect(1);
  
  // Preparing the element
  var elem = document.getElementById("hexagonal-grid");
  
  // Creating a grid
  var grid = hex.grid(elem);
  ok(grid, "hex.grid(elem)");
  
  // Additional setup steps
  setupGrid(grid);
  
});

test("hex.grid(hexagonal-horizontal)", function() {

  expect(1);

  // Preparing the element
  var elem = document.getElementById("hexagonal-horizontal-grid");

  // Creating a grid
  var grid = hex.grid(elem, { type: "hexagonal_horizontal" });
  ok(grid, "hex.grid(elem)");

  // Additional setup steps
  setupGrid(grid);

});

test("hex.grid(rectangular)", function() {
  
  expect(1);
  
  // Preparing the element
  var elem = document.getElementById("rectangular-grid");
  
  // Creating a grid
  var grid = hex.grid(elem, { type: "rectangular" });
  ok(grid, "hex.grid(elem, {type:'rectangular'})");
  
  // Additional setup steps
  setupGrid(grid);
  
});

test("hex.grid(skew)", function() {
  
  expect(1);
  
  // Preparing the element
  var elem = document.getElementById("skew-grid");
  
  // Creating a grid
  var grid = hex.grid(elem, { type: "skew" });
  ok(grid, "hex.grid(elem, {type:'skew'})");
  
  // Additional setup steps
  setupGrid(grid);
  
});

test("hex.grid(triangular)", function() {
  
  expect(1);
  
  // Preparing the element
  var elem = document.getElementById("triangular-grid");
  
  // Creating a grid
  var grid = hex.grid(elem, { type: "triangular" });
  ok(grid, "hex.grid(elem, {type:'triangular'})");
  
  // Additional setup steps
  setupGrid(grid);
  
});

