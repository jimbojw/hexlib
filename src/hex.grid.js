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
		if (!this.events) this.events = {};
		if (this.events[type] === undefined) this.events[type] = [];
		this.events[type].push(handler);
		return this;
	},
	
	/**
	 * Tile characteristics.
	 */
	tile: {
		height: 42,
		width: 48
	},
	
	/**
	 * Determine to which quadrant a given screen coordinate pair corresponds.
	 * @param posx The horizontal screen coordinate.
	 * @param posy The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	quadrant: function quadrant( posx, posy ) {
		var 
			w = this.tile.width,
			h = this.tile.height,
			qx = Math.floor( ( posx - w * 0.25 ) / ( w * 0.75 ) ),
			qy = Math.floor( ( posy ) / h );
		return { x:qx, y:qy };
	},
	
	/**
	 * Given a pair of hex coordinates, calculates the appropriate screen position.
	 * @param hexx The horizontal hexagonal grid coordinate.
	 * @param hexy The "vertical" hexagonal grid coordinate (30 degrees up from horizontal).
	 * @return An object with an x and y property, mapping to the actual screen coordinates.
	 */
	screenpos: function screenpos( hexx, hexy ) {
		var
			w = this.tile.width * 0.75,
			h = this.tile.height,
			sx = hexx * w,
			sy = -hexy * h - hexx * h * 0.5;
		return { x: sx, y: sy };
	},
	
	/**
	 * Translate a pair of x/y screen coordinates into the geometry appropriate coordinates of this grid.
	 * @param posx The horizontal screen coordinate.
	 * @param posy The vertical screen coordinate.
	 * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
	 */
	translate: function translate( posx, posy ) {

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
			px = ( posx - w4 ) % w34,
			py = ( posy ) % h;
		if (px < 0) px += w34;
		if (py < 0) py += h;
		px -= w2;
	
		// Mode determined by x quadrant
		if (qx % 2) {
	
			// |_/|  A-type quadrant
			// | \|
		
			// Start with simple cases
			var
				x = qx,
				y = (1 - qx) * 0.5 - qy - (py > h2 ? 1 : 0);
			if ( px <= 0 || py == h2 ) return { x: x, y: y };
		
			// Make adjustments if click happend in right-hand third of the quadrant
			if ( py < h2 && py > ( h2 - px * m ) ) return { x: x+1, y: y-1 };
			if ( py > h2 && py < ( h2 + px * m ) ) return { x: x+1, y: y };
		
		} else {
	
			// | \|  B-type quadrant
			// | /|
		
			// Start with simple case
			var
				x = qx,
				y = -qx * 0.5 - qy;
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
		
		// Keep track of the last tile hovered for mouseover purposes
		var lastTile = { x: null, y: null };
		
		// Handler for any mouse movement event
		function mousemove(event) {

			// Short-circuit if there are no tileover or tileout events
			if (!g.events || (!g.events.tileover && !g.events.tileout)) return;
			
			var
				// Details about the mouse event and location/size of the grid 
				rawpos = event.mousepos(),
				elempos = hex.position(elem),
				elemsize = hex.size(elem),
	
				// Determine whether the event happened inside the bounds of the grid element
				inside = (
					rawpos.x > elempos.x &&
					rawpos.x < elempos.x + elemsize.x &&
					rawpos.y > elempos.y &&
					rawpos.y < elempos.y + elemsize.y
				),
				
				timeout = 10,
				tileover = g.events.tileover,
				tileout = g.events.tileout,

				// Determine the grid-centric coordinates of the latest hovered tile
				pos = event.mousepos(g.root),
				trans = g.translate(pos.x, pos.y);
			
			// Short-circuit if we're inside and there's nothing to do
			// NOTE: For example, on a mouseout or mouseover where the mousemove already covered it
			if (inside && lastTile.x === trans.x && lastTile.y === trans.y) return;
				
			// Queue up tileout callbacks if there are any
			if (tileout && lastTile.x !== null && lastTile.y !== null) {
				for (var i=0, l=tileout.length; i<l; i++) {
					(function(callback, x, y){
						setTimeout(function(){
							callback(x, y);
						}, timeout++);
					})(tileout[i], lastTile.x, lastTile.y);
				}
			}

			if (inside) {

				// Queue up tileover callbacks if there are any
				if (tileover) {
					for (var i=0, l=tileover.length; i<l; i++) {
						(function(callback, x, y){
							setTimeout(function(){
								callback(x, y);
							}, timeout++);
						})(tileover[i], trans.x, trans.y);
					}
				}
			
				lastTile.x = trans.x;
				lastTile.y = trans.y;

			} else {

				lastTile.x = null;
				lastTile.y = null;

			}

		}
		
		// Add DOM event handlers to grid element
		hex.addEvent(elem, "mousemove", mousemove);
		hex.addEvent(elem, "mouseover", mousemove);
		hex.addEvent(elem, "mouseout", mousemove);

		return g;
	}
	
});

})();
