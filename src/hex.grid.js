/**
 * hex.grid.js
 */
(function(){

var
	undefined,
	window = this,
	hex = window.hex;

/**
 * The Grid prototype.
 */	
var Grid = {
	
	/**
	 * Translate a pair of x/y screen coordinates into the geometry appropriate coordinates of this grid.
	 * @param x The horizontal screen coordinate.
	 * @param y The vertical screen coordinate.
	 * @param An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	translate: function translate( x, y ) {
		// TODO: Implement me!
	}
	
};
	
hex.extend(hex, {
	
	/**
	 * Create a grid for a particular DOM element.
	 * @param elem DOM element over which to superimpose a grid.
	 * @param options Options hash defining characteristics of the grid.
	 * @return A grid object.
	 */
	grid: function grid( elem, options ) {
		if (!elem) throw "no DOM element supplied";
		// TODO: Finish me!
		return hex.create(Grid, options, { element: elem });
	}
	
});

})();
