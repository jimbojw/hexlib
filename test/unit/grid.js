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

test("grid.origin()", function() {
	expect(0);
	// TODO: Add tests!
});

test("hex.grid(hexagonal)", function() {
	
	expect(1);
	
	// Preparing the element	
	var elem = document.getElementById("hexagonal-grid");

	// Creating a grid
	var grid = hex.grid(elem);
	ok(grid, "hex.grid(elem)");

	// Element to show the previously hovered tile
	var prev = document.createElement("div");
	prev.style.position = "absolute";
	prev.style.border = "2px solid yellow"
	prev.style.width = (grid.tileWidth - 4) + "px";
	prev.style.height = (grid.tileHeight - 2) + "px";
	prev.style.display = "none";
	grid.root.appendChild(prev);

	// Element to show the currently hovered tile
	var curr = document.createElement("div");
	curr.style.position = "absolute";
	curr.style.border = "2px solid green"
	curr.style.width = (grid.tileWidth - 4) + "px";
	curr.style.height = (grid.tileHeight - 2) + "px";
	curr.style.display = "none";
	grid.root.appendChild(curr);

	// Extra element to mark the origin
	var marker = document.createElement("div");
	marker.style.position = "absolute";
	marker.style.border = "5px ridge red"
	marker.style.left = "-5px";
	marker.style.top = "-5px";
	grid.root.appendChild(marker);
	
	// Setting mouse movement related tile events
	grid.addEvent("tileover", function(x, y) {
		hex.log([x, y], "tileover");
		var inv = grid.screenpos(x, y);
		curr.style.left = inv.x + "px";
		curr.style.top = inv.y + "px";
	});
	grid.addEvent("tileout", function(x, y) {
		hex.log([x, y], "tileout");
		var inv = grid.screenpos(x, y);
		prev.style.left = inv.x + "px";
		prev.style.top = inv.y + "px";
	});

	// Setting mouse button related tile events
	grid.addEvent("tiledown", function(x, y) {
		hex.log([x, y], "tiledown");
	});
	grid.addEvent("tileup", function(x, y) {
		hex.log([x, y], "tileup");
	});
	grid.addEvent("tileclick", function(x, y) {
		hex.log([x, y], "tileclick");
	});

	// Setting mouse movement related grid events
	grid.addEvent("gridover", function(x, y) {
		hex.log([x, y], "gridover");
		curr.style.display = "";
		prev.style.display = "";
	});
	grid.addEvent("gridout", function(x, y) {
		hex.log([x, y], "gridout");
		curr.style.display = "none";
		prev.style.display = "none";
	});
	
	// Center the root element.
	var size = hex.size(elem);
	grid.origin(size.x * 0.5, size.y * 0.5);
	
});

test("hex.grid(rectangular)", function() {
	
	expect(1);
	
	// Preparing the element	
	var elem = document.getElementById("rectangular-grid");

	// Creating a grid
	var grid = hex.grid(elem, { type: "rectangular" });
	ok(grid, "hex.grid(elem, {type:'rectangular'})");

	// Element to show the previously hovered tile
	var prev = document.createElement("div");
	prev.style.position = "absolute";
	prev.style.border = "2px solid yellow"
	prev.style.width = (grid.tileWidth - 5) + "px";
	prev.style.height = (grid.tileHeight - 5) + "px";
	prev.style.margin = "1px 0 0 1px";
	prev.style.display = "none";
	grid.root.appendChild(prev);

	// Element to show the currently hovered tile
	var curr = document.createElement("div");
	curr.style.position = "absolute";
	curr.style.border = "2px solid green"
	curr.style.width = (grid.tileWidth - 5) + "px";
	curr.style.height = (grid.tileHeight - 5) + "px";
	curr.style.margin = "1px 0 0 1px";
	curr.style.display = "none";
	grid.root.appendChild(curr);

	// Extra element to show the origin
	var marker = document.createElement("div");
	marker.style.position = "absolute";
	marker.style.border = "5px ridge red"
	marker.style.left = "-5px";
	marker.style.top = "-5px";
	grid.root.appendChild(marker);

	// Setting mouse movement related tile events
	grid.addEvent("tileover", function(x, y) {
		hex.log([x, y], "tileover");
		var inv = grid.screenpos(x, y);
		curr.style.left = inv.x + "px";
		curr.style.top = inv.y + "px";
	});
	grid.addEvent("tileout", function(x, y) {
		hex.log([x, y], "tileout");
		var inv = grid.screenpos(x, y);
		prev.style.left = inv.x + "px";
		prev.style.top = inv.y + "px";
	});

	// Setting mouse button related tile events
	grid.addEvent("tiledown", function(x, y) {
		hex.log([x, y], "tiledown");
	});
	grid.addEvent("tileup", function(x, y) {
		hex.log([x, y], "tileup");
	});
	grid.addEvent("tileclick", function(x, y) {
		hex.log([x, y], "tileclick");
	});

	// Setting mouse movement related grid events
	grid.addEvent("gridover", function(x, y) {
		hex.log([x, y], "gridover");
		curr.style.display = "";
		prev.style.display = "";
	});
	grid.addEvent("gridout", function(x, y) {
		hex.log([x, y], "gridout");
		curr.style.display = "none";
		prev.style.display = "none";
	});
	
	// Center the root element.
	var size = hex.size(elem);
	grid.origin(size.x * 0.5, size.y * 0.5);
	
});


