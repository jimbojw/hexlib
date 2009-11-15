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
	marker.innerHTML = "<!-- -->";
	marker.style.position = "absolute";
	marker.style.border = "5px ridge red";
	marker.style.height = "0px";
	marker.style.width = "0px";
	marker.style.left = "-5px";
	marker.style.top = "-5px";
	grid.root.appendChild(marker);
	
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
	
	// Setting mouse movement related grid events
	grid.addEvent("gridover", function(x, y) {
		curr.style.display = "";
		prev.style.display = "";
	});
	grid.addEvent("gridout", function(x, y) {
		curr.style.display = "none";
		prev.style.display = "none";
	});
	
	// Center the root element.
	var size = hex.size(grid.elem);
	grid.reorient(size.x * 0.5, size.y * 0.5);
	
	// Setting region events
	region.addEvent("regionover", function(x, y) {
		hex.log([x, y], "regionover");
	});
	region.addEvent("regionout", function(x, y) {
		hex.log([x, y], "regionout");
	});
	region.addEvent("regiondown", function(x, y) {
		hex.log([x, y], "regiondown");
	});
	region.addEvent("regionup", function(x, y) {
		hex.log([x, y], "regionup");
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
			return (
				( x === 0 && y === 0 ) ||
				( x > -2 && x < 2 && y > -2 && y < 2 )
			);
		}
	});
	ok(region, "hex.region(grid)");
	
	// Additional setup steps
	setupRegionedGrid(region);
	
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

