/**
 * hex.grid.rectangular.js
 */
(function(){

var
	undefined,
	window = this,
	floor = Math.floor,
	hex = window.hex;

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
			y: recty * this.tileHeight
		};
	},
	
	/**
	 * Rectangular tile characteristics.
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
			y: floor( posy / this.tileHeight )
		};
	}

};

})();
