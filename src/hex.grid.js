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
	 * Default option values.
	 */
	defaults: {
		type: "hexagonal"
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
		
		// Combine options to default values
		var options = hex.extend({}, Grid.defaults, options);
		
		// Check that the particular grid type provides all reqired functions
		if (grid[options.type] === undefined) {
			throw "hex.grid." + options.type + " does not exist";
		}
		
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
		var g = hex.create(
			Grid,
			grid[options.type],
			options, {
				element: elem,
				root: root
			}
		);
		
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
