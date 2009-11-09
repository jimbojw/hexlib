/**
 * grid.js
 * Tests for hex.grid.js functionality.
 */

module("grid");

test("hex.grid()", function() {
	
	expect(3);
	
	// Basic availability
	ok(hex.grid, "hex.grid");
	throwing(function() {
		hex.grid();
	}, "no DOM element supplied", "hex.grid()");

	// Preparing the element	
	var elem = document.getElementById("hexagonal-grid");

	// Creating a grid
	var grid = hex.grid(elem);
	ok(grid, "hex.grid(elem)");

	// DEBUGGING	
	var prev = document.createElement("div");
	prev.style.position = "absolute";
	prev.style.border = "1px solid red"
	prev.style.width = (grid.tileWidth - 2) + "px";
	prev.style.height = (grid.tileHeight - 2) + "px";
	grid.root.appendChild(prev);

	var curr = document.createElement("div");
	curr.style.position = "absolute";
	curr.style.border = "1px solid green"
	curr.style.width = (grid.tileWidth - 2) + "px";
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
	grid.root.style.border = "2px ridge yellow";
	
	return;
	
	// DEBUGGING
	var q = document.createElement("div");
	q.style.position = "absolute";
	q.style.border = "1px solid blue"
	q.style.width = (grid.tileWidth * 0.75 - 2) + "px";
	q.style.height = (grid.tileHeight - 2) + "px";
	grid.root.appendChild(q);

	var h = document.createElement("div");
	h.style.position = "absolute";
	h.style.border = "1px solid yellow"
	h.style.width = (grid.tileWidth - 2) + "px";
	h.style.height = (grid.tileHeight - 2) + "px";
	grid.root.appendChild(h);

	// Add DOM event handlers to grid element
	hex.addEvent(elem, "mousemove", function(event) {
		var
			pos = event.mousepos(grid.root),
			quad = grid.quadrant(pos.x, pos.y),
			trans = grid.translate(pos.x, pos.y),
			inv = grid.screenpos(trans.x, trans.y);
		hex.log("mousemove", [trans.x, trans.y]);
		q.style.left = ( grid.tileWidth * 0.25 + quad.x * grid.tileWidth * 0.75 ) + "px";
		q.style.top = ( quad.y * grid.tileHeight ) + "px";
		h.style.left = ( inv.x ) + "px";
		h.style.top = ( inv.y ) + "px";
	});
	
});


