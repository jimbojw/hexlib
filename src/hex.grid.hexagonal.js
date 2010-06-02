/**
 * hex.grid.hexagonal.js
 */
(function(hex, undefined){

var
	floor = Math.floor;

/**
 * The hexagonal grid prototype.
 */
hex.grid.hexagonal = {
	
	/**
	 * Determine to which quadrant a given screen coordinate pair corresponds.
	 * @param posx The horizontal screen coordinate.
	 * @param posy The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	quadrant: function quadrant( posx, posy ) {
		
		var 
			w = this.tileWidth,
			h = this.tileHeight,
			qx = floor( ( posx - w * 0.25 ) / ( w * 0.75 ) ),
			qy = floor( ( posy ) / h );
		
		return {
			x: qx,
			y: qy
		};
		
	},
	
	/**
	 * Given a pair of hex coordinates, calculates the appropriate screen position.
	 * @param hexx The horizontal hexagonal grid coordinate.
	 * @param hexy The "vertical" hexagonal grid coordinate (30 degrees up from horizontal).
	 * @return An object with an x and y property, mapping to the actual screen coordinates.
	 */
	screenpos: function screenpos( hexx, hexy ) {
		
		var
			w = this.tileWidth * 0.75,
			h = this.tileHeight,
			sx = hexx * w,
			sy = -hexy * h - hexx * h * 0.5;
			
		return {
			x: sx,
			y: sy
		};
		
	},
	
	/**
	 * Hexagon tile characteristics.
	 */
	tileHeight: 42,
	tileWidth: 48,
	
	/**
	 * Translate a pair of x/y screen coordinates into the geometry appropriate coordinates of this grid.
	 * @param posx The horizontal screen coordinate.
	 * @param posy The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	translate: function translate( posx, posy ) {
		
		// Useful shorthand values
		var
			w2 = this.tileWidth * 0.5,
			w4 = w2 * 0.5,
			w34 = w4 * 3,
			h = this.tileHeight,
			h2 = h * 0.5,
			m = h2 / w4,
			x,
			y;
		
		// Determine the "quadrant" in which the click occurred (there are two types, as discussed later)
		var
			q = this.quadrant( posx, posy ),
			qx = q.x,
			qy = q.y;
		
		// Based on the quadrant, calculate the pixel offsets of the click within the quadrant
		var
			px = ( posx - w4 ) % w34,
			py = ( posy ) % h;
		if (px < 0) {
			px += w34;
		}
		if (py < 0) {
			py += h;
		}
		px -= w2;
		
		// Mode determined by x quadrant
		if (qx % 2) {
			
			// |_/|  A-type quadrant
			// | \|
			
			// Start with simple cases
			x = qx;
			y = (1 - qx) * 0.5 - qy - (py > h2 ? 1 : 0);
			if ( px <= 0 || py == h2 ) {
				return {
					x: x,
					y: y
				};
			}
			
			// Make adjustments if click happend in right-hand third of the quadrant
			if ( py < h2 && py > ( h2 - px * m ) ) {
				return {
					x: x+1,
					y: y-1
				};
			}
			if ( py > h2 && py < ( h2 + px * m ) ) {
				return {
					x: x+1,
					y: y
				};
			}
			
		} else {
			
			// | \|  B-type quadrant
			// | /|
			
			// Start with simple case
			x = qx;
			y = -qx * 0.5 - qy;
			if ( px <= 0 || py == h2 ) {
				return {
					x: x,
					y: y
				};
			}
			
			// Make adjusments if the click happend in the latter third
			if ( py < h2 && py < px * m ) {
				return {
					x: x+1,
					y: y
				};
			}
			if ( py > h2 && py > ( h - px * m ) ) {
				return {
					x: x+1,
					y: y-1
				};
			}
		}
		
		// fall through case - no adjustments necessary
		return {
			x: x,
			y: y
		};
		
	}
	
};

})(window.hex);

