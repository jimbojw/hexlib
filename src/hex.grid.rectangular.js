/**
 * hex.grid.rectangular.js
 */
(function(hex, undefined){

var
	ceil = Math.ceil,
	floor = Math.floor;

/**
 * The rectangular grid prototype.
 */
hex.grid.rectangular = {
	
	/**
	 * Given a pair of rectangular grid coordinates, calculate the appropriate screen position.
	 * @param rectx The horizontal rectangular grid coordinate.
	 * @param recty The vertical rectangular grid coordinate.
	 * @return An object with an x and y property, mapping to the actual screen coordinates.
	 */
	screenpos: function screenpos( rectx, recty ) {
		return {
			x: rectx * this.tileWidth,
			y: -recty * this.tileHeight
		};
	},
	
	/**
	 * Rectangular tile characteristics.
	 * NOTE: Override these using the options hash passed into hex.grid().
	 */
	tileHeight: 48,
	tileWidth: 48,
	
	/**
	 * Translate a pair of x/y screen coordinates into rectangular grid coordinates.
	 * @param posx The horizontal screen coordinate.
	 * @param posy The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	translate: function translate( posx, posy ) {
		return {
			x: floor( posx / this.tileWidth ),
			y: ceil( -posy / this.tileHeight )
		};
	}
	
};

})(window.hex);

