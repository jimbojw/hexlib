/**
 * hex.grid.skew.js
 * Implementation for arbitrary parallelogram-based boards (for example, a field of diamonds). This is not 
 * a popular grid type in and of itself, since it is identical in principle to a rectangular grid.  However, a 
 * lozenge based grid is the basis of an equalaterial triangular grid, so it's a useful abstraction.
 */
(function(hex, undefined){

var
	floor = Math.floor;

/**
 * The rectangular grid prototype.
 */
hex.grid.skew = {
	
	/**
	 * Tile characteristics, denoted as the two vectors pointing away from the origin:
	 *   - e1 - Coordinates of (1,0) in pixels
	 *   - e2 - Coordinates of (0,1) in pixels
	 * For example, the default values listed here define a diamond (lozenge) based grid, where:
	 *   - (-21,-36) is the left corner,           /\ <-- origin 
	 *   - (0, 0) is the top corner (origin),    ,/  \. 
	 *   - (21, -36) is the right corner, and     \  / 
	 *   - (0, -72) is the bottom corner.          \/  
	 * For another example, consider:
	 *   - if e1 is (48, 0), and
	 *   - if e2 is (0, -48), then
	 *   - this defines a square grid with lines spaced 48 px apart.
	 * Note: The negative y values in the preceding examples are necessary to counter the
	 *   fact that screen coordinates are measured from the top down, and we probably want positive grid
	 *   coordinates to extend upwards from the origin (like a normal graph).
	 * Override e1 and e2 using the options hash passed into hex.grid().
	 */
	e1: {
		x: 21,  //   \ <-- origin
		y: -36  //    \. 
	},
	e2: {
		x: -21, //    / <-- origin
		y: -36  //  ,/
	},
	
	/**
	 * Initialize precomputed values.
	 */
	init: function init() {
		
		var
			x1 = this.e1.x,
			y1 = this.e1.y,
			x2 = this.e2.x,
			y2 = this.e2.y;
		
		// Calculate the inverse 2x2 transformation matrix coefficient.
		if (x1 * y2 === x2 * y1) {
			throw "incomputable coefficient";
		}
		this.coefficient = 1.0 / ( x1 * y2 - x2 * y1 );
		
		// Determine smallest x and y coordinates of the four corners
		var
			xs = [x1, x1 + x2, x2],
			ys = [y1, y1 + y2, y2],
			maxx = 0,
			minx = 0,
			maxy = 0,
			miny = 0;
		for (var i=0; i<3; i++) {
			if (xs[i] > maxx) {
				maxx = xs[i];
			}
			if (xs[i] < minx) {
				minx = xs[i];
			}
			if (ys[i] > maxy) {
				maxy = ys[i];
			}
			if (ys[i] < miny) {
				miny = ys[i];
			}
		}
		
		// Set the offset and tile sizes accordingly
		this.tileWidth = maxx - minx;
		this.tileHeight = maxy - miny;
		this.offset = {
			x: -minx,
			y: -miny
		};
	},
	
	/**
	 * Given a pair of skew grid coordinates, calculate the appropriate screen position.
	 * @param x The horizontal skew grid coordinate.
	 * @param y The vertical skew grid coordinate.
	 * @return An object with an x and y property, mapping to the actual screen coordinates.
	 */
	screenpos: function screenpos( x, y ) {
		return {
			x: ( x * this.e1.x + y * this.e2.x ),
			y: ( x * this.e1.y + y * this.e2.y )
		};
	},
	
	/**
	 * Translate a pair of x/y screen coordinates into skew grid coordinates.
	 * @param x The horizontal screen coordinate.
	 * @param y The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	translate: function translate( x, y ) {
		
		var c = this.coefficient;
		
		x = x - this.offset.x;
		y = y - this.offset.y;
		
		return {
			x: floor( c * ( x * this.e2.y - y * this.e2.x ) ),
			y: floor( c * ( y * this.e1.x - x * this.e1.y ) )
		};
		
	}
	
};

})(window.hex);

