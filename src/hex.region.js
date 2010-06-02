/**
 * hex.region.js
 */
(function(hex, undefined){

/**
 * The Region prototype.
 */
var Region = hex.create(hex.evented);

hex.extend(hex, {
	
	/**
	 * Create a region associated with a given grid.
	 * @param grid The grid to which to associate the region.
	 * @param options Options hash defining characteristics of the region.
	 * @return A region object.
	 */
	region: function region( grid, options ) {
		
		// Confirm that a grid was supplied
		if (!grid) {
			throw "no grid was supplied";
		}
		
		// Combine options to default values
		options = hex.extend({}, options);
		
		// Check that the inside() option is a function
		if (typeof options.inside !== "function") {
			throw "options.inside is not a function";
		}
		
		// Create the region
		var r = hex.create(Region, options, {
			grid: grid
		});
		
		// Keep track of whether the last tile was inside the region
		var wasInside = false;
		
		// Add grid movenment events
		grid.addEvent("tileover", function(e, x, y) {
			var inside = r.inside(x, y);
			if (inside !== wasInside) {
				r.trigger(inside ? "regionover" : "regionout", x, y);
			}
			wasInside = inside;
		});
		grid.addEvent("gridout", function(e, x, y) {
			if (wasInside) {
				r.trigger("regionout", x, y);
			}
			wasInside = false;
		});
		
		// Keep track of whether the last moused tile was inside the region
		var downInside = false;
		
		// Add grid click events
		grid.addEvent("tiledown", function(e, x, y) {
			var inside = r.inside(x, y);
			if (inside) {
				r.trigger("regiondown", x, y);
			}
			downInside = inside;
		});
		grid.addEvent("tileup", function(e, x, y) {
			if (r.inside(x, y)) {
				r.trigger("regionup", x, y);
				if (downInside) {
					r.trigger("regionclick", x, y);
				}
			}
		});
		
		return r;
		
	}
	
});

})(window.hex);

