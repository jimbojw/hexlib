/**
 * hex.grid.triangular.js
 */
(function(hex, undefined){

var
	floor = Math.floor;

/**
 * The triangular grid prototype.
 * 
 * Coordinate explanation:
 * 
 *    |/   \ /   \ /   \ /  
 *    |-----;-----;-----;-    y
 *    |-1,1/ \1,1/ \   /     / 
 *    | \ /0,1\ /2,1\ /     /
 *    |--;-----;-----;-----;
 *    | / \1,0/ \3,0/ \   / 
 *    |/0,0\ /2,0\ /4,0\ /  
 *    +-----^-----^-----^-----> x
 */
hex.grid.triangular = {
	
	/**
	 * Tile characteristics.
	 */
	tileHeight: 48,
	tileWidth: 56,
	
	/**
	 * Initialize precomputed values.
	 */
	init: function init() {
		
		var
			h = this.tileHeight,
			w = this.tileWidth;
		
		// Express tile characteristics as the two vectors pointing away from the origin.
		// See hex.grid.skew.js for more info.
		this.e1 = {
			x: w,        //   |  
			y: 0         //  ,+---> e1
		};
		this.e2 = {
			x: w * 0.5,  //    / e2
			y: -h        //  ,/___
		};
		
		// Call skew grid initializer
		hex.grid.skew.init.call(this);
		
		// Reset tileHeight and tileWidth (skew.init may have modified them)
		this.tileHeight = h;
		this.tileWidth = w;
		
	},
	
	/**
	 * Given a pair of skew grid coordinates, calculate the appropriate screen position.
	 * @param x The horizontal skew grid coordinate.
	 * @param y The vertical skew grid coordinate.
	 * @return An object with an x and y property, mapping to the actual screen coordinates.
	 */
	screenpos: function screenpos( x, y ) {
		return hex.grid.skew.screenpos.call(this, x * 0.5, y);
	},
	
	/**
	 * Translate a pair of x/y screen coordinates into triangular grid coordinates.
	 * @param x The horizontal screen coordinate.
	 * @param y The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	translate: function translate( x, y ) {
		
		x = x - this.offset.x;
		y = y - this.offset.y;
		
		var
			c = this.coefficient,
			x1 = c * ( x * this.e2.y - y * this.e2.x ),
			y1 = c * ( y * this.e1.x - x * this.e1.y ),
			x2 = floor( x1 ),
			y2 = floor( y1 ),
			xd = ( x1 + y1 - x2 - y2 > 1 ? 1 : 0 );
		
		return {
			x: x2 * 2.0 + xd,
			y: y2
		};
		
	}
	
};

})(window.hex);
