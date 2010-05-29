/**
 * hex.core.js
 */
(function(window, document, undefined){

var
	
	hex = window.hex = {
		version: '0.1'
	},
	
	join = Array.prototype.join,
	slice = Array.prototype.slice,
	has = Object.prototype.hasOwnProperty;

/**
 * Anonymous function used in constructing objects from prototypes.
 */
function anonymous(){
}

/**
 * Extend one object with the properties of any other object(s).
 * @param obj The object to extend.
 * @param args Additional arguments - the objects from which to copy properties.
 * @return The object which was extended.
 */
function extend( obj /*, args ... */ ) {
	for (var i=0, l=arguments.length; i<l; i++) {
		var other = arguments[i];
		if (other) {
			for (var k in other) {
				if (has.call(other, k)) {
					obj[k] = other[k];
				}
			}
		}
	}
	return obj;
}
hex.extend = extend;

extend(hex, {
	
	/**
	 * Creates a new object with the specified prototypal parent, exteded by provided additional object arguments.
	 * @param parent The prototypal parent object.
	 * @param args Any number of additonal arguments (optional).
	 * @return A new object with the prototypal parent set, extended by the provided args.
	 */
	create: function create( parent /*, args ... */ ) {
		if (!parent) {
			throw "no parent supplied";
		}
		var args = slice.call(arguments, 1);
		anonymous.prototype = parent;
		var obj = new anonymous();
		if (!args.length) {
			return obj;
		}
		args.unshift(obj);
		return extend.apply(undefined, args);
	},
	
	/**
	 * Key method, for making a key string out of scalar parameters.
	 * @param args Any number of scalar arguments.
	 * @return A string containing the arguments concatenated by a separator.
	 */
	key: function key( /* args ... */ ) {
		return join.call(arguments, ',');
	},
	
	/**
	 * Log arguments if the browser supports it.
	 * @param args Any number of arguments to log.
	 */
	log: function log( /* args ... */ ) {
		if (this.debug && window.console) {
			console.log.apply(console, arguments);
		}
	}
	
});

})(window, window.document);

