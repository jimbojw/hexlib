/**
 * hex.event.js
 * Library methods for DOM and non-DOM events.
 */
(function(hex, undefined){

var
	slice = Array.prototype.slice;

/**
 * The rich event prototype for non-DOM (hex) events.
 */
var HexEvent = {
	
};

hex.extend(hex, {
	
	/**
	 * The evented prototype, for non-DOM objects which support handling non-DOM events.
	 */
	evented: {
		
		/**
		 * Adds an event handler.
		 * @param type The type of event to which to respond.
		 * @param handler The function to execute.
		 * @return this.
		 */
		addEvent: function addEvent( type, handler ) {
			if (!this.events) {
				this.events = {};
			}
			var handlers = this.events[type];
			if (handlers === undefined) {
				handlers = this.events[type] = [];
			}
			handlers[handlers.length] = handler;
			return this;
		},
		
		/**
		 * Triggers an event to fire.
		 * Note: Exceptions thrown in handlers will not interrupt other handlers.
		 * @param type The type of event to fire.
		 * @param args Any additional arguments to pass to handlers.
		 * @return An object containing information about the callback execution, or false if there was nothing to do.
		 */
		trigger: function trigger( type /*, args ... */ ) {
			
			if (!this.events || !this.events[type]) {
				return false;
			}
			
			var
				timeout = 10,
				handlers = this.events[type],
				args = slice.call(arguments, 0),
				i = 0,
				l = handlers.length,
				prevented = false,
				e = args[0] = hex.create(HexEvent, {
					type: type,
					preventDefault: function preventDefault() {
						prevented = true;
					}
				}),
				errors = [];
			
			while (i<l) {
				try {
					while (i<l) {
						handlers[i++].apply(this, args);
					}
				} catch (err) {
					errors[errors.length] = err;
					setTimeout(function(){
						throw err;
					}, timeout++);
				}
			}
			
			return {
				event: e,
				errors: errors,
				prevented: prevented,
				args: args
			};
			
		},
		
		/**
		 * Queue up an event to fire later (using the fire method).
		 * @param type The type of event to fire.
		 * @param args Any additional arguments to pass to handlers.
		 */
		queue: function queue( type /*, args ... */ ) {
			var q = this.eventqueue;
			if (!q) {
				q = this.eventqueue = [];
			}
			q[q.length] = slice.call(arguments, 0);
		},
		
		/**
		 * Sequentially trigger any previously queued events.
		 */
		fire: function fire() {
			var q = this.eventqueue;
			if (!q || !q.length) {
				return;
			}
			while (q.length) {
				this.trigger.apply(this, q.shift());
			}
		}
		
	}
	
});

/**
 * The rich event "prototype" for DOM events.
 */
var DOMEvent = {
	
	/**
	 * Grab the actual target element of the masked event.
	 * @return The target element.
	 */
	getTarget: function getTarget() {
		var t = this.target || this.srcElement;
		if (!t) {
			return undefined;
		}
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
	 * @see http://developer.apple.com/safari/library/documentation/appleapplications/reference/safariwebcontent/handlingevents/handlingevents.html
	 * @param elem DOM element for relative position calculation (optional).
	 * @return Object with an x and y property for the screen location in pixels.
	 */
	mousepos: function mousepos( elem ) {
		
		var
			touch,
			x = 0,
			y = 0;
		
		if (this.touches && this.touches.length) {
			touch = this.touches[0];
			x = touch.pageX;
			y = touch.pageY;
		} else if (this.changedTouches && this.changedTouches.length) {
			touch = this.changedTouches[0];
			x = touch.pageX;
			y = touch.pageY;
		} else if (this.pageX !== undefined && this.pageY !== undefined) {
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
		
		return {
			x: x,
			y: y
		};
		
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
	},
	
	/**
	 * Stop the event from propagating.
	 */
	stopPropagation: function stopPropagation() {
		var e = this.event;
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	}
	
};

var Handler;

if (document.addEventListener) {
	
	/**
	 * The Handler prototype.
	 */
	Handler = {
		
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
				return handler.call(elem, hex.create(e, DOMEvent, {event : e}));
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
	Handler = {
		
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
				return handler.call(elem, hex.extend({}, e, DOMEvent, { event: e }));
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

})(window.hex);

