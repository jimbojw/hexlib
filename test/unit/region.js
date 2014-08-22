/**
 * region.js
 * Tests for hex.region.js functionality.
 */

module("region");

test("hex.region()", function() {
  
  expect(3);
  
  // Basic availability
  ok(hex.region, "hex.region");
  
  // Throws when missing required fields
  throwing(function() {
    hex.region();
  }, "no grid was supplied", "hex.region()");
  
  // Throws when bad options are passed
  throwing(function() {
    hex.region( { }, { inside: false } );
  }, "options.inside is not a function", "hex.region(inside:false)");
  
});

// Add markers and other DOM goodies to regioned grids
function setupRegionedGrid( region ) {
  
  var grid = region.grid;
  
  // Attach region backdrop
  var backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  grid.root.appendChild(backdrop);
  
  // Element to show the currently hovered tile
  var curr = document.createElement("div");
  curr.style.textAlign = "center";
  curr.style.lineHeight = grid.tileHeight + "px";
  curr.style.position = "absolute";
  curr.style.border = "4px outset green";
  curr.style.background = "lightgreen";
  curr.style.width = (grid.tileWidth - 7) + "px";
  curr.style.height = (grid.tileHeight - 7) + "px";
  curr.style.display = "none";
  grid.root.appendChild(curr);
  
  // Setting mouse movement related tile events
  grid.addEvent("tileover", function(e, x, y) {
    var inv = grid.screenpos(x, y);
    curr.style.left = inv.x + "px";
    curr.style.top = inv.y + "px";
    curr.innerHTML = [x, y] + '';
  });
  
  // Disable panning if the tiledown event happened in the region
  grid.addEvent("tiledown", function(e, x, y) {
    if (region.inside(x, y)) {
      e.preventDefault(); // the "default" tiledown action is to begin panning
    }
  });
  
  // Center the root element.
  var size = hex.size(grid.elem);
  grid.reorient(size.x * 0.5, size.y * 0.5);
  
  // Announce an event to the log
  function announce(e, x, y) {
    hex.log([x, y], e.type);
  }
  region.addEvent("regionover", announce);
  region.addEvent("regionout", announce);
  region.addEvent("regiondown", announce);
  region.addEvent("regionup", announce);
  region.addEvent("regionclick", announce);
  
  // Setting region UI events
  region.addEvent("regionover", function(e, x, y) {
    curr.style.display = "";
  });
  region.addEvent("regionout", function(e, x, y) {
    curr.style.display = "none";
  });
  region.addEvent("regiondown", function (e, x, y) {
    curr.style.borderStyle = "inset";
    curr.style.background = "green";
  });
  
  // Special case for when the hold is released
  function release(e, x, y) {
    curr.style.borderStyle = "outset";
    curr.style.background = "lightgreen";
  }
  grid.addEvent("gridout", release);
  grid.addEvent("tileup", function(e, x, y) {
    release(e, x, y);
    grid.trigger("tileover", x, y);
  });
}

test("hex.region(hexagonal grid)", function() {
  
  expect(2);
  
  // Preparing the element
  var elem = document.getElementById("regioned-hexagonal-grid");
  
  // Creating a grid
  var grid = hex.grid(elem);
  ok(grid, "hex.grid(elem)");
  
  // Creating a region
  var region = hex.region(grid, {
    inside: function inside(x, y) {
      // In the neighborhood of 0,0
      if (x < -2 || x > 2) return false;
      if (x === -2 && (y < 0 || y > 2)) return false;
      if (x === -1 && (y < -1 || y > 2)) return false;
      if (x === 0 && (y < -2 || y > 2)) return false;
      if (x === 1 && (y < -2 || y > 1)) return false;
      if (x === 2 && (y < -2 || y > 0)) return false;
      return true;
      return (
        ( x === 0 && y === 0 ) ||
        ( x > -2 && x < 2 && y > -2 && y < 2 )
      );
    }
  });
  ok(region, "hex.region(grid)");
  
  // Additional setup steps
  setupRegionedGrid(region);
  
  grid.reorient(grid.origin.x - grid.tileWidth * 0.5, grid.origin.y - grid.tileHeight * 0.5);
  
});

test("hex.region(hexagonal-horizontal grid)", function() {

  expect(2);

  // Preparing the element
  var elem = document.getElementById("regioned-hexagonal-horizontal-grid");

  // Creating a grid
  var grid = hex.grid(elem, { type: "hexagonal_horizontal" });
  ok(grid, "hex.grid(elem)");

  // Creating a region
  var region = hex.region(grid, {
    inside: function inside(x, y) {
      // In the neighborhood of 0,0
      if (x < -2 || x > 2) return false;
      if (x === -2 && (y < 0 || y > 2)) return false;
      if (x === -1 && (y < -1 || y > 2)) return false;
      if (x === 0 && (y < -2 || y > 2)) return false;
      if (x === 1 && (y < -2 || y > 1)) return false;
      if (x === 2 && (y < -2 || y > 0)) return false;
      return true;
      return (
        ( x === 0 && y === 0 ) ||
        ( x > -2 && x < 2 && y > -2 && y < 2 )
      );
    }
  });
  ok(region, "hex.region(grid)");

  // Additional setup steps
  setupRegionedGrid(region);

  grid.reorient(grid.origin.x - grid.tileWidth * 0.5, grid.origin.y - grid.tileHeight * 0.5);

});

test("hex.region(rectangular grid)", function() {
  
  expect(2);
  
  // Preparing the element
  var elem = document.getElementById("regioned-rectangular-grid");
  
  // Creating a grid
  var grid = hex.grid(elem, { type: "rectangular" });
  ok(grid, "hex.grid(elem, {type:'rectangular'})");
  
  // Creating a region
  var region = hex.region(grid, {
    inside: function inside(x, y) {
      // A simple 2x2 box around the origin
      return (x > -3 && x < 2 && y > -2 && y < 3);
    }
  });
  ok(region, "hex.region(grid)");
  
  // Additional setup steps
  setupRegionedGrid(region);
  
});

