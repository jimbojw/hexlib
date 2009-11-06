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
	 * Adds a grid event and handler.
	 * @param type The type of event to which to respond.
	 * @param handler The function to execute.
	 * @return this.
	 */
	addEvent: function addEvent( type, handler ) {
		// TODO: Implement me!
	},
	
	/**
	 * Tile characteristics.
	 */
	tile: {
		height: 40,
		width: 45
	},
	
	/**
	 * Determine to which quadrant a given screen coordinate pair corresponds.
	 * @param posx The horizontal screen coordinate.
	 * @param posy The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	quadrant: function quadrant( posx, posy ) {
		// TODO: FIX ME!
		var 
			w = this.tile.width,
			h = this.tile.height,
			ox = parseInt( this.root.style.left ),
			oy = parseInt( this.root.style.top ),
			qx = Math.floor( ( posx - ox ) / ( w * 0.75 ) ),
			qy = Math.floor( ( posy - oy ) / h );
		return { x:qx, y:qy };
	},
	
	/**
	 * Translate a pair of x/y screen coordinates into the geometry appropriate coordinates of this grid.
	 * @param posx The horizontal screen coordinate.
	 * @param posy The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	translate: function translate( posx, posy ) {

		// Origin position
		var
			ox = parseInt( this.root.style.left ),
			oy = parseInt( this.root.style.top );
		
		// Adjust for root element offset (panning)
		posx -= ox;
		posy -= oy;
	
		// Useful shorthand values
		var
			w2 = this.tile.width * 0.5,
			w4 = w2 * 0.5,
			w34 = w4 * 3,
			h = this.tile.height,
			h2 = h * 0.5,
			m = h2 / w4;
	
		// Determine the "quadrant" in which the click occurred (there are two types, as discussed later)
		var
			q = this.quadrant( posx, posy ),
			qx = q.x,
			qy = q.y;
		
		// Based on the quadrant, calculate the pixel offsets of the click within the quadrant
		var
			px = ( posx - w4 - ox ) % w34,
			py = ( posy - oy ) % h;
		if (px < 0) px += w34;
		if (py < 0) py += h;
		px -= w2;
	
		// Mode determined by x quadrant
		if (qx % 2) {
	
			// |_/|  A-type quadrant
			// | \|
		
			// Start with simple cases
			var x = qx, y = (1 - qx) * 0.5 - qy - (py > h2 ? 1 : 0);
			if ( px <= 0 || py == h2 ) return { x: x, y: y };
		
			// Make adjustments if click happend in right-hand third of the quadrant
			if ( py < h2 && py > ( h2 - px * m ) ) return { x: x+1, y: y-1 };
			if ( py > h2 && py < ( h2 + px * m ) ) return { x: x+1, y: y };
		
		} else {
	
			// | \|  B-type quadrant
			// | /|
		
			// Start with simple case
			var x = qx, y = -qx * 0.5 - qy;
			if ( px <= 0 || py == h2 ) return { x: x, y: y };

			// Make adjusments if the click happend in the latter third
			if ( py < h2 && py < px * m ) return { x: x+1, y: y };
			if ( py > h2 && py > ( h - px * m ) ) return { x: x+1, y: y-1 };
		}
	
		return { x: x, y: y };
	
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
		
		// Confirm that an element was supplied
		if (!elem || elem.nodeType !== 1) throw "no DOM element supplied";
		
		// Setting necessary grid element characteristics
		var position = hex.style(elem, "position");
		if (position !== "relative" && position !== "absolute") {
			elem.style.position = "relative";
		}
		
		// Create and attach the root element
		var root = document.createElement("div");
		root.style.position = "absolute";
		root.style.left = "0px";
		root.style.top = "0px";
		root.style.overflow = "visible";
		elem.appendChild(root);
		
		// Create the grid object
		var g = hex.create(Grid, options, {
			element: elem,
			root: root
		});
		
		// DEBUGGING
		var q = document.createElement("div");
		q.style.position = "absolute";
		q.style.border = "1px solid blue"
		q.style.width = (g.tile.width * 0.75) + "px";
		q.style.height = (g.tile.height) + "px";
		elem.appendChild(q);

		// Add DOM event handlers to grid element
		hex.addEvent(elem, "mousemove", function(event) {
			var
				pos = event.mousepos(elem),
				quad = g.quadrant(pos.x, pos.y);
			console.log("mousemove", [pos.x, pos.y], [quad.x, quad.y]);
			q.style.left = (quad.x * 30) + "px";
			q.style.top = (quad.y * 40) + "px";
		});
		
		return g;
	}
	
});

})();
