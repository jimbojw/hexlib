/**
 * hex.region.js
 */
(function(){

var
	undefined,
	window = this,
	hex = window.hex;

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
		var options = hex.extend({}, options);
		
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
		grid.addEvent("tileover", function(x, y) {
			var inside = r.inside(x, y);
			if (inside !== wasInside) {
				r.trigger(inside ? "regionover" : "regionout", 10, x, y);
			}
			wasInside = inside;
		});
		grid.addEvent("gridout", function(x, y) {
			if (wasInside) {
				r.trigger("regionout", 10, x, y);
			}
			wasInside = false;
		});
		
		// Keep track of whether the last moused tile was inside the region
		var downInside = false;
		
		// Add grid click events
		grid.addEvent("tiledown", function(x, y) {
			var inside = r.inside(x, y);
			if (inside) {
				r.trigger("regiondown", 10, x, y);
			}
			downInside = inside;
		});
		grid.addEvent("tileup", function(x, y) {
			var timeout = 10;
			if (r.inside(x, y)) {
				timeout = r.trigger("regionup", timeout, x, y);
				if (downInside) {
					r.trigger("regionclick", timeout, x, y);
				}
			}
		});
		
		return r;
		
	}
	
});

})();
