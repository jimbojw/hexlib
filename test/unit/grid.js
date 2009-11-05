/**
 * grid.js
 * Tests for hex.grid.js functionality.
 */

module("grid");

test("hex.grid()", function() {
	expect(2);
	ok(hex.grid, "hex.grid");
	throwing(function() {
		hex.grid();
	}, "no DOM element supplied", "hex.grid()");
});


