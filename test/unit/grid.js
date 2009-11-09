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

test("hex.grid(hexagonal)", function() {
	
	expect(1);
	
	// Preparing the element	
	var elem = document.getElementById("hexagonal-grid");

	// Creating a grid
	var grid = hex.grid(elem);
	ok(grid, "hex.grid(elem)");

	// DEBUGGING	
	var prev = document.createElement("div");
	prev.style.position = "absolute";
	prev.style.border = "2px solid yellow"
	prev.style.width = (grid.tileWidth - 4) + "px";
	prev.style.height = (grid.tileHeight - 2) + "px";
	grid.root.appendChild(prev);

	var curr = document.createElement("div");
	curr.style.position = "absolute";
	curr.style.border = "2px solid green"
	curr.style.width = (grid.tileWidth - 4) + "px";
	curr.style.height = (grid.tileHeight - 2) + "px";
	grid.root.appendChild(curr);

	// Setting grid events
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
	
	// Reorient the root elem.
	grid.root.style.left = ( parseInt( hex.style(elem, "width") ) * 0.5 ) + "px";
	grid.root.style.top = ( parseInt( hex.style(elem, "height") ) * 0.5 ) + "px";
	
	// Extra DOM element to show the origin
	var origin = document.createElement("div");
	origin.style.position = "absolute";
	origin.style.border = "5px ridge red"
	origin.style.left = "-5px";
	origin.style.top = "-5px";
	grid.root.appendChild(origin);
	
});

test("hex.grid(rectangular)", function() {
	
	expect(1);
	
	// Preparing the element	
	var elem = document.getElementById("rectangular-grid");

	// Creating a grid
	var grid = hex.grid(elem, { type: "rectangular" });
	ok(grid, "hex.grid(elem, {type:'rectangular'})");

	// DEBUGGING	
	var prev = document.createElement("div");
	prev.style.position = "absolute";
	prev.style.border = "2px solid yellow"
	prev.style.width = (grid.tileWidth - 5) + "px";
	prev.style.height = (grid.tileHeight - 5) + "px";
	prev.style.margin = "1px 0 0 1px";
	grid.root.appendChild(prev);

	var curr = document.createElement("div");
	curr.style.position = "absolute";
	curr.style.border = "2px solid green"
	curr.style.width = (grid.tileWidth - 5) + "px";
	curr.style.height = (grid.tileHeight - 5) + "px";
	curr.style.margin = "1px 0 0 1px";
	grid.root.appendChild(curr);

	// Setting grid events
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
	
	// Reorient the root elem.
	grid.root.style.left = ( parseInt( hex.style(elem, "width") ) * 0.5 ) + "px";
	grid.root.style.top = ( parseInt( hex.style(elem, "height") ) * 0.5 ) + "px";
	
	// Extra DOM element to show the origin
	var origin = document.createElement("div");
	origin.style.position = "absolute";
	origin.style.border = "5px ridge red"
	origin.style.left = "-5px";
	origin.style.top = "-5px";
	grid.root.appendChild(origin);

});


