/**
 * hex.event.js
 */
(function(){

var
	undefined,
	window = this,
	hex = window.hex;

/**
 * The rich Event "prototype".
 */	
var Event = {
	
	/**
	 * Grab the actual target element of the masked event.
	 * @return The target element.
	 */
	getTarget: function getTarget() {
		var t = this.target || this.srcElement;
		if (!t) return undefined;
		if (t.nodeType === 3) t = t.parentNode;
		return t;
	},
	
	/**
	 * Determine the screen coordinates for a mouse event (click, mouseover, etc).
	 * @see http://www.quirksmode.org/js/events_properties.html#position
	 * @return Object with an x and y property for the screen location in pixels.
	 */
	mousepos: function mousepos() {
		var x = 0, y = 0;
		if (this.pageX !== undefined && this.pageY !== undefined) {
			x = this.pageX;
			y = this.pageY;
		} else if (this.clientX !== undefined && this.clientY !== undefined) {
			x = this.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = this.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x: x, y: y };
	}

};

hex.extend(hex, {
	
	/**
	 * Adds an event handler to the supplied DOM element.
	 * @param elem The DOM element to which to attach the event.
	 * @param type String representing the type of event to hook (ex: "click").
	 * @param handler Function to handle the event.
	 * @return this.
	 */
	addEvent: function addEvent( elem, type, handler ) {
		function callback(e) {
			if (!e) var e = window.event;
			return handler.call(elem, hex.create(e, Event));
		}
		if (elem.addEventListener) {
			elem.addEventListener(type, callback, false);
		} else if (elem.attachEvent) {
			elem.attachEvent("on" + type, callback);
		}
		return this;
	}
	
});

})();
