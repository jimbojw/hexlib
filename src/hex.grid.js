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
	
		// Type of grid to construct.
		type: "hexagonal"
		
	},
	
	/**
	 * Get or set the origin position for the grid element.
	 * @param x The horizontal position from the left in pixels (optional).
	 * @param y The vertical position from the top in pixels (optional).
	 * @return The old origin position.
	 */
	origin: function origin( x, y ) {
	
		// Determine current offset position of the origin
		var
			elempos = hex.position(this.elem),
			rootpos = hex.position(this.root),
			pos = {
				x: rootpos.x - elempos.x,
				y: rootpos.y - elempos.y
			};
		
		// Set the origin position if requested
		if (x !== undefined && y !== undefined) {
			
			x = +x;
			y = +y;
			this.root.style.left = x + "px";
			this.root.style.top = y + "px";
			this.elem.style.backgroundPosition = x + "px " + y + "px";
			
		}
		
		return pos;
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
			Grid, {
				events: {}
			},
			grid[options.type],
			options, {
				elem: elem,
				root: root
			}
		);
		
		// Keep track of the last tile hovered for mouseover purposes
		var lastTile = { x: null, y: null };
		
		// Keep track of the panning state
		var pan = {
			panning: false,
			x: null,
			y: null
		};
		
		// Handler for any mouse movement events
		function mousemove(event) {
		
			// Handle panning
			// TODO: FIX ME!
			if (false && pan.panning) {
				var mousepos = event.mousepos(root);
				g.origin(
					mousepos.x - pan.x,
					mousepos.y - pan.y
				);
			}

			// Short-circuit if there are no tile or grid events
			if (
				!g.events.tileover &&
				!g.events.tileout &&
				!g.events.gridover &&
				!g.events.gridout
			) return;
			
			var
				// Determine whether the event happened inside the bounds of the grid element
				inside = event.inside(elem),
				
				timeout = 10,
				tileover = g.events.tileover,
				tileout = g.events.tileout,
				gridover = g.events.gridover,
				gridout = g.events.gridout,

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

			// Queue up gridout callbacks if applicable
			if (!inside && gridout && lastTile.x !== null && lastTile.y !== null) {
				for (var i=0, l=gridout.length; i<l; i++) {
					(function(callback, x, y){
						setTimeout(function(){
							callback(x, y);
						}, timeout++);
					})(gridout[i], lastTile.x, lastTile.y);
				}
			}

			if (inside) {

				// Queue up gridover callbacks if applicable
				if (gridover && lastTile.x === null && lastTile.y === null) {
					for (var i=0, l=gridover.length; i<l; i++) {
						(function(callback, x, y){
							setTimeout(function(){
								callback(x, y);
							}, timeout++);
						})(gridover[i], trans.x, trans.y);
					}
				}

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
		
		// Add DOM event handlers to grid element for mouse movement
		hex.addEvent(elem, "mousemove", mousemove);
		hex.addEvent(elem, "mouseover", mousemove);
		hex.addEvent(elem, "mouseout", mousemove);
		
		// Keep track of last tile mousedown'ed on
		var downTile = { x: null, y: null };

		// Handler for any mouse button events
		function mousebutton(event) {
		
			// Short-circuit if there are no tiledown, tileup or tileclick events
			if (!g.events.tiledown && !g.events.tileup && !g.events.tileclick) return;
			
			// Short-circuit if the event happened outside the bounds of the grid element.
			if (!event.inside(elem)) return;
				
			var
				timeout = 10,
				tiledown = g.events.tiledown,
				tileup = g.events.tileup,
				tileclick = g.events.tileclick,

				// Determine the grid-centric coordinates of the latest hovered tile
				pos = event.mousepos(g.root),
				trans = g.translate(pos.x, pos.y);

			if (event.type === "mousedown") {

				// Queue up tiledown callbacks
				if (tiledown) {
					for (var i=0, l=tiledown.length; i<l; i++) {
						(function(callback, x, y){
							setTimeout(function(){
								callback(x, y);
							}, timeout++);
						})(tiledown[i], trans.x, trans.y);
					}
				}
				
				// Remember mousedown target (to test for "click" later)
				downTile.x = trans.x;
				downTile.y = trans.y;
				
				// Begin panning
				pan.panning = true;
				pan.x = pos.x;
				pan.y = pos.y;
				
			} else if (event.type === "mouseup") {
			
				// Queue up tileup callbacks
				if (tileup) {
					for (var i=0, l=tileup.length; i<l; i++) {
						(function(callback, x, y){
							setTimeout(function(){
								callback(x, y);
							}, timeout++);
						})(tileup[i], trans.x, trans.y);
					}
				}

				// Queue up tileclick callbacks
				if (tileclick && downTile.x === trans.x && downTile.y === trans.y) {
					for (var i=0, l=tileclick.length; i<l; i++) {
						(function(callback, x, y){
							setTimeout(function(){
								callback(x, y);
							}, timeout++);
						})(tileclick[i], trans.x, trans.y);
					}
				}
				
				// Clear mousedown target
				downTile.x = null;
				downTile.y = null;

				// Cease panning
				pan.panning = false;
				pan.x = pos.x;
				pan.y = pos.y;
				
			}
			
		}

		// Add DOM event handlers to grid element for mouse movement
		hex.addEvent(elem, "mousedown", mousebutton);
		hex.addEvent(elem, "mouseup", mousebutton);

		return g;
	}
	
});

})();
