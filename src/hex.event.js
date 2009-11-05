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
	 * Determine the screen coordinates for a mouse event (click, mouseover, etc).
	 * @see http://www.quirksmode.org/js/events_properties.html#position
	 * @return Object with an x and y property for the screen location in pixels.
	 */
	mousepos: function mousepos(e) {
		if (!e) var e = this.event;
		var x = 0, y = 0;
		if (e.pageX || e.pageY) {
			x = e.pageX;
			y = e.pageY;
		} else if (e.clientX || e.clientY) 	{
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return { x: x, y: y };
	},

	/**
	 * Grab the actual target element of the masked event.
	 * @return The target element.
	 */
	target: function target(e) {
		if (!e) var e = this.event;
		var t = e.target || e.srcElement;
		if (!t) return undefined;
		if (t.nodeType === 3) t = t.parentNode;
		return t;
	}
	
};

hex.extend(hex, {
	
	/**
	 * Expose Event library.
	 */
	event: Event,
	
	/**
	 * Adds an event handler to the supplied DOM element.
	 * @param elem The DOM element to which to attach the event.
	 * @param type String representing the type of event to hook (ex: "click").
	 * @param handler Function to handle the event.
	 * @return this.
	 */
	addEvent: function addEvent( elem, type, handler ) {
		if (elem.addEventListener) {
			elem.addEventListener(type, handler, false);
		} else if (elem.attachEvent) {
			elem.attachEvent("on" + type, handler);
		}
		return this;
	},
	
	/**
	 * Adds a rich event handler to an element.
	 * @param elem The DOM element to which to attach the event.
	 * @param type String representing the type of event to hook (ex: "click").
	 * @param handler Function to handle the event.
	 * @return this.
	 */
	richEvent: function richEvent( elem, type, handler ) {
		function callback(e) {
			if (!e) var e = window.event;
			var event = hex.create(e, Event, { event: e });
			return handler.call(elem, event);
		}
		return hex.addEvent(elem, type, callback);
	}
	
});

})();
