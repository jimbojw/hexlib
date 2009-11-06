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
	
	// Setting grid events
	grid.addEvent("tileover", function(event) {
		var
			screenpos = event.mousepos(),
			gridpos = grid.translate(screenpos.x, screenpos.y);
		console.log("tileover", [screenpos.x, screenpos.y], [gridpos.x, gridpos.y]);
	});
	
	
	
});


