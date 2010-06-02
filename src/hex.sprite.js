/**
 * hex.sprite.js
 */
(function(hex, undefined){

/**
 * The sprite prototype.
 */
var Sprite = {
	
	
	
};

/**
 * The sprite layer prototype.
 */
var SpriteLayer = {
	
	/**
	 * Default layer options.
	 */
	defaults: {
		
		// Number of milliseconds between frames
		delay: 100, 
		
		// Whether to continue to animate, or just once through
		repeat: false
		
	},
	
	/**
	 * Animate the sprite layer.
	 * @param options Object containing animation options.
	 */
	animate: function animate( options ) {
		
		options = hex.extend({}, SpriteLayer.defaults, options);
		
		var
			elem = this.elem,
			coords = this.coords,
			x = coords[0],
			y = coords[1],
			len = coords[2],
			width = this.sprite.spritemap.width,
			repeat = options.repeat,
			i=0,
			timeout;
		
		function callback() {
			i++;
			if (i >= len) {
				if (repeat) {
					i = 0;
				} else {
					window.clearTimeout(timeout);
					return;
				}
			}
			elem.style.left = ( -(x + i) * width ) + "px";
		}
		
		timeout = this.timeout = window.setInterval(callback, options.delay);
		
	},
	
	/**
	 * Stop layer animation.
	 */
	stop: function stop() {
		
		window.clearTimeout(this.timeout);
		
	}
	
};

/**
 * The spritemap prototype.
 */
var SpriteMap = {
	
	/**
	 * Default spritemap options.
	 */
	defaults: {
	},
	
	/**
	 * Create a new sprite with specified layers.
	 * @param layers Strings indicating what sprite to put on each layer.
	 * @return A sprite object.
	 */
	sprite: function sprite( /* layers */ ) {
		
		// Create the sprite
		var s = hex.create(Sprite, {
			spritemap: this
		});
		
		// Setup the base element
		var base = s.base = document.createElement('div');
		base.className = "sprite";
		hex.extend(base.style, {
			position: "relative",
			overflow: "hidden",
			width: this.width + "px",
			height: this.height + "px"
		});
		
		// Setup layers
		var layers = s.layers = [];
		for (var i=0, l=arguments.length; i<l; i++) {
			
			var
				type = arguments[i],
				coords = this.map[type],
				x = coords[0],
				y = coords[1],
				elem = document.createElement('div');
			
			layers[i] = hex.create(SpriteLayer, {
				type: type,
				elem: elem,
				sprite: s,
				coords: coords
			});
			
			hex.extend(elem.style, {
				position: "absolute",
				width: this.mapwidth + "px",
				height: this.mapheight + "px",
				top: ( -y * this.height ) + "px",
				left: ( -x * this.width ) + "px",
				backgroundImage: "url('" + this.url + "')",
				filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.url + "', sizingMethod='crop')"
			});
			
			base.appendChild(elem);
			
		}
		
		return s;
		
	}
	
};

hex.extend(hex, {
	
	/**
	 * Build a sprite map.
	 * @param options Object containing configuration options.
	 * @return A sprite map.
	 */
	spritemap: function spritemap( options ) {
		
		// Throw exception if no options were supplied
		if (options === undefined) {
			throw "no options hash was supplied";
		}
		
		// Extend options with defaults
		options = hex.extend({}, SpriteMap.defaults, options);
		
		// Determine the dimensions of the image
		var
			map = options.map,
			x = 0,
			y = 0;
		for (var k in map) {
			var coords = map[k];
			if (coords[0] > x) {
				x = coords[0];
			}
			if (coords[1] > y) {
				y = coords[1];
			}
		}
		
		// Create spritemap
		var sm = hex.create(SpriteMap, {
			mapwidth: ( ( x + 1 ) * options.width ),
			mapheight: ( ( y + 1 ) * options.height )
		}, options);
		
		return sm;
	}
	
});

})(window.hex);

