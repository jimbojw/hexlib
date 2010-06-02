/**
 * hex.element.js
 */
(function(hex, undefined){

hex.extend(hex, {
	
	/**
	 * Determines the real on-screen position of a DOM element.
	 * @see http://www.quirksmode.org/js/findpos.html
	 * @param elem The DOM element to inspect.
	 * @return An object with x and y properties to represent the position.
	 */
	position: function position( elem ) {
		var
			left = elem.offsetLeft,
			top = elem.offsetTop;
		elem = elem.offsetParent;
		while (elem) {
			left += elem.offsetLeft;
			top += elem.offsetTop;
			elem = elem.offsetParent;
		}
		return {
			x: left,
			y: top
		};
	},
	
	/**
	 * Determines the size of a DOM element.
	 * @param elem The DOM element to inspect.
	 * @return An object with x and y properties to represent the dimensions.
	 */
	size: function size( elem ) {
		return {
			x: elem.offsetWidth,
			y: elem.offsetHeight
		};
	},
	
	/**
	 * Retrieves the computed style of a given DOM element.
	 * @see http://www.quirksmode.org/dom/getstyles.html
	 * @param elem The DOM element to inspect.
	 * @param property The CSS property to look up.
	 * @return The computed style value.
	 */
	style: function style( elem, property ) {
		var value;
		if (elem.currentStyle) {
			value = elem.currentStyle[property];
		} else if (window.getComputedStyle) {
			value = document.defaultView.getComputedStyle(elem, null).getPropertyValue(property);
		}
		return value;
	}
	
});

})(window.hex);

