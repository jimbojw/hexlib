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
	
	// Element to show the previously hovered tile
	var prev = document.createElement("div");
	prev.style.textAlign = "center";
	prev.style.lineHeight = grid.tileHeight + "px";
	prev.style.position = "absolute";
	prev.style.border = "4px outset yellow";
	prev.style.background = "yellow";
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
	curr.style.background = "lightgreen";
	curr.style.width = (grid.tileWidth - 7) + "px";
	curr.style.height = (grid.tileHeight - 7) + "px";
	curr.style.display = "none";
	grid.root.appendChild(curr);
	
	// Setting mouse movement related tile events
	grid.addEvent("tileover", function(x, y) {
		var inv = grid.screenpos(x, y);
		curr.style.left = inv.x + "px";
		curr.style.top = inv.y + "px";
		curr.innerHTML = [x, y] + '';
	});
	grid.addEvent("tileout", function(x, y) {
		var inv = grid.screenpos(x, y);
		prev.style.left = inv.x + "px";
		prev.style.top = inv.y + "px";
		prev.innerHTML = [x, y] + '';
	});
	
	// Center the root element.
	var size = hex.size(grid.elem);
	grid.reorient(size.x * 0.5, size.y * 0.5);
	
	// Setting region events
	region.addEvent("regionover", function(x, y) {
		hex.log([x, y], "regionover");
		curr.style.display = "";
		prev.style.display = "";
	});
	region.addEvent("regionout", function(x, y) {
		hex.log([x, y], "regionout");
		curr.style.display = "none";
		prev.style.display = "none";
	});
	region.addEvent("regiondown", function(x, y) {
		hex.log([x, y], "regiondown");
		curr.style.borderStyle = "inset";
		curr.style.background = "green";
	});
	region.addEvent("regionup", function(x, y) {
		hex.log([x, y], "regionup");
		curr.style.borderStyle = "outset";
		curr.style.background = "lightgreen";
	});
	region.addEvent("regionclick", function(x, y) {
		hex.log([x, y], "regionclick");
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

