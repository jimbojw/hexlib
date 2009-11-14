/**
 * hex.grid.triangular.js
 */
(function(){

var
	undefined,
	window = this,
	floor = Math.floor,
	hex = window.hex;

/**
 * The triangular grid prototype.
 */
hex.grid.triangular = {
	
	/**
	 * Tile characteristics, denoted as the two vectors pointing away from the origin.
	 * See hex.grid.skew.js for more info.
	 */
	e1: {
		x: 28,  //   \ <-- origin
		y: -48  //    \. 
	},
	e2: {
		x: -28, //    / <-- origin
		y: -48  //  ,/
	},
	
	/**
	 * Initialize precomputed values.
	 */
	init: function init() {
		
		hex.grid.skew.init.call(this);
		this.tileHeight = this.tileHeight * 0.5;
		
	},
	
	/**
	 * Given a pair of skew grid coordinates, calculate the appropriate screen position.
	 * @param x The horizontal skew grid coordinate.
	 * @param y The vertical skew grid coordinate.
	 * @return An object with an x and y property, mapping to the actual screen coordinates.
	 */
	screenpos: function screenpos( x, y ) {
		var
			skewpos = hex.grid.skew.screenpos.call(this, x * 0.5, y),
			mod = x % 2,
			xd = mod ? -this.tileWidth * 0.25 : 0;
			yd = mod ? this.tileHeight * 0.5 : this.tileHeight;
		return {
			x: skewpos.x + xd,
			y: skewpos.y + yd
		};
	},
	
	/**
	 * Translate a pair of x/y screen coordinates into skew grid coordinates.
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

})();
