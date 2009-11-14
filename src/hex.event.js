/**
 * hex.event.js
 */
(function(){

var
	undefined,
	window = this,
	document = window.document,
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
		return ( t.nodeType === 3 ? t.parentNode : t );
	},
	
	/**
	 * Determine whether the event ocurred within the bounds of the provided element.
	 * @param elem DOM element for relative position calculation (optional).
	 * @return Object with an x and y property for the screen location in pixels.
	 */
	inside: function inside( elem ) {
		// Details about the event coordinates and location/size of the element 
		var
			pos = this.mousepos(),
			position = hex.position(elem),
			size = hex.size(elem);
		
		// Determine whether the event happened inside the bounds of the element
		return (
			pos.x > position.x &&
			pos.x < position.x + size.x &&
			pos.y > position.y &&
			pos.y < position.y + size.y
		);
	},
	
	/**
	 * Determine the screen coordinates for a mouse event (click, mouseover, etc).
	 * @see http://www.quirksmode.org/js/events_properties.html#position
	 * @param elem DOM element for relative position calculation (optional).
	 * @return Object with an x and y property for the screen location in pixels.
	 */
	mousepos: function mousepos( elem ) {
		var
			x = 0,
			y = 0;
		if (this.pageX !== undefined && this.pageY !== undefined) {
			x = this.pageX;
			y = this.pageY;
		} else if (this.clientX !== undefined && this.clientY !== undefined) {
			x = this.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = this.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		if (elem) {
			var pos = hex.position(elem);
			x = x - pos.x;
			y = y - pos.y;
		}
		return { x: x, y: y };
	},
	
	/**
	 * Prevent the browser default action.
	 */
	preventDefault: function preventDefault() {
		var e = this.event;
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	}
	
};

if (document.addEventListener) {
	
	/**
	 * The Handler prototype.
	 */
	var Handler = {
		
		/**
		 * Remove the handler from the object to which it was previously attached.
		 */
		remove: function remove() {
			return this.elem.removeEventListener(this.type, this.callback);
		}
		
	};
	
	hex.extend(hex, {
		
		/**
		 * Adds an event handler to the supplied DOM element.
		 * @param elem The DOM element to which to attach the event.
		 * @param type String representing the type of event to hook (ex: "click").
		 * @param handler Function to handle the event.
		 * @return Handler instance .
		 */
		addEvent: function addEvent( elem, type, handler ) {
			function callback(e) {
				return handler.call(elem, hex.create(e, Event, {event : e}));
			}
			elem.addEventListener(type, callback, false);
			return hex.create(Handler, {
				callback: callback,
				elem: elem,
				handler: handler,
				type: type
			});
		},
		
		/**
		 * Removes an event handler from the supplied DOM element.
		 * @param elem The DOM element to which to remove the event.
		 * @param type String representing the type of event to hook (ex: "click").
		 * @param handler Function to remove.
		 */
		removeEvent: function removeEvent( elem, type, handler ) {
			elem.removeEventListener(type, handler, false);
		}
		
	});
	
} else if (document.attachEvent) {
	
	
	/**
	 * The Handler prototype.
	 */
	var Handler = {
		
		/**
		 * Remove the handler from the object to which it was previously attached.
		 */
		remove: function remove() {
			return this.elem.detachEvent("on" + this.type, this.callback);
		}
		
	};
	
	hex.extend(hex, {
		
		/**
		 * Adds an event handler to the supplied DOM element.
		 * @param elem The DOM element to which to attach the event.
		 * @param type String representing the type of event to hook (ex: "click").
		 * @param handler Function to handle the event.
		 * @return Handler instance .
		 */
		addEvent: function addEvent( elem, type, handler ) {
			function callback() {
				var e = window.event;
				return handler.call(elem, hex.extend({}, e, Event, { event: e }));
			}
			function remove(){
				elem.detachEvent("on" + type, callback);
				window.detachEvent("onunload", remove);
			}
			elem.attachEvent("on" + type, callback);
			window.attachEvent("onunload", remove);
			return hex.create(Handler, {
				callback: callback,
				elem: elem,
				handler: handler,
				type: type
			});
		},
		
		/**
		 * Removes an event handler from the supplied DOM element.
		 * @param elem The DOM element to which to remove the event.
		 * @param type String representing the type of event to hook (ex: "click").
		 * @param handler Function to remove.
		 */
		removeEvent: function removeEvent( elem, type, handler ) {
			elem.detachEvent("on" + type, handler);
		}
		
	});
	
}

})();
