/**
 * hex.grid.js
 */
(function(hex, undefined){

/**
 * The Grid prototype.
 */
var Grid = hex.create(hex.evented, {
  
  /**
   * Default option values.
   */
  defaults: {
    
    // Type of grid to construct.
    type: "hexagonal",
    
    // Threshold for tiletap event (ms)
    tapthreshold: 400
    
  },
  
  /**
   * Set the origin position for the grid element.
   * @param x The horizontal position from the left in pixels.
   * @param y The vertical position from the top in pixels.
   */
  reorient: function reorient( x, y ) {
    this.origin.x = +x;
    this.origin.y = +y;
    this.root.style.left = x + "px";
    this.root.style.top = y + "px";
    this.elem.style.backgroundPosition = x + "px " + y + "px";
  }
  
});

hex.extend(hex, {
  
  /**
   * Create a grid for a particular DOM element.
   * @param elem DOM element over which to superimpose a grid.
   * @param options Options hash defining characteristics of the grid.
   * @return A grid object.
   */
  grid: function grid( elem, options ) {
    
    // Confirm that an element was supplied
    if (!elem || elem.nodeType !== 1) {
      throw "no DOM element supplied";
    }
    
    // Combine options to default values
    options = hex.extend({}, Grid.defaults, options);
    
    // Check that the particular grid type provides all reqired functions
    if (hex.grid[options.type] === undefined) {
      throw "hex.grid." + options.type + " does not exist";
    }
    
    // Setting necessary grid element characteristics
    var position = hex.style(elem, "position");
    if (position !== "relative" && position !== "absolute") {
      elem.style.position = "relative";
    }
    if (hex.style(elem, "overflow") !== "hidden") {
      elem.style.overflow = "hidden";
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
        events: {},
        origin: {
          x: 0,
          y: 0
        }
      },
      hex.grid[options.type],
      options, {
        elem: elem,
        root: root
      }
    );
    
    // Keep track of the last tile hovered for mouseover purposes
    var lastTile = {
      x: null,
      y: null
    };
    
    // Keep track of the panning state
    var pan = {
      enabled: true,
      panning: false,
      x: null,
      y: null
    };
    
    // Handler for any mouse movement events
    function mousemove(event) {
      
      var
        // Determine whether the event happened inside the bounds of the grid element
        inside = event.inside(elem),
        
        // Determine mouse position
        mousepos = event.mousepos(elem),
        pos = {
          x: mousepos.x - g.origin.x,
          y: mousepos.y - g.origin.y
        };
      
      // Handle panning
      if (pan.panning && pan.enabled) {
        if (inside) {
          var
            px = pos.x - pan.x,
            py = pos.y - pan.y;
          root.style.left = px + "px";
          root.style.top = py + "px";
          elem.style.backgroundPosition = px + "px " + py + "px";
          g.trigger("panmove", mousepos.x - pan.x - 2 * g.origin.x, mousepos.y - pan.y - 2 * g.origin.y);
        }
        return;
      }
      
      var
        tileover = g.events.tileover,
        tileout = g.events.tileout,
        gridover = g.events.gridover,
        gridout = g.events.gridout;
      
      // Short-circuit if there are no tile or grid events
      if (!tileover && !tileout && !gridover && !gridout) {
        return;
      }
      
      var
        
        // Determine the grid-centric coordinates of the latest actioned tile
        trans = g.translate(pos.x, pos.y);
      
      // Short-circuit if we're inside and there's nothing to do
      // NOTE: For example, on a mouseout or mouseover where the mousemove already covered it
      if (inside && lastTile.x === trans.x && lastTile.y === trans.y) {
        return;
      }
      
      // Queue up tileout callbacks if there are any
      if (tileout && lastTile.x !== null && lastTile.y !== null) {
        g.queue("tileout", lastTile.x, lastTile.y);
      }
      
      // Queue up gridout callbacks if applicable
      if (!inside && gridout && lastTile.x !== null && lastTile.y !== null) {
        g.queue("gridout", lastTile.x, lastTile.y);
      }
      
      if (inside) {
        
        // Queue up gridover callbacks if applicable
        if (gridover && lastTile.x === null && lastTile.y === null) {
          g.queue("gridover", trans.x, trans.y);
        }
        
        // Queue up tileover callbacks if there are any
        if (tileover) {
          g.queue("tileover", trans.x, trans.y);
        }
        
        lastTile.x = trans.x;
        lastTile.y = trans.y;
        
      } else {
        
        lastTile.x = null;
        lastTile.y = null;
        
      }
      
      // Fire off queued events
      g.fire();
    
    }
    
    // Add DOM event handlers to grid element for mouse movement
    hex.addEvent(elem, "mousemove", mousemove);
    hex.addEvent(elem, "mouseover", mousemove);
    hex.addEvent(elem, "mouseout", mousemove);
    hex.addEvent(elem, "touchmove", mousemove);
    hex.addEvent(elem, "touchstart", mousemove);
    hex.addEvent(elem, "touchend", mousemove);
    hex.addEvent(elem, "MozTouchDown", mousemove);
    hex.addEvent(elem, "MozTouchMove", mousemove);
    hex.addEvent(elem, "MozTouchUp", mousemove);
    hex.addEvent(elem, "MozTouchRelease", mousemove);
    
    // Keep track of last tile mousedown'ed on
    var downTile = {
      x: null, 
      y: null
    };
    
    // Keep track of when the last tiledown event happened
    var downTime = null;
    
    // Handler for any mouse button events
    function mousebutton(e) {
      
      var event = e.event;
      
      // Short-circuit if the event happened outside the bounds of the grid element.
      if (!e.inside(elem)) {
        return;
      }
      
      // Determine the event type and coordinates
      var
        type = event.type,
        mousepos = e.mousepos(elem);
      
      // Prevents browser-native dragging of child elements (ex: dragging an image)
      if (type === "mouseup" || type === "mousedown") {
        e.preventDefault();
      }
      
      // prevent touch-hold-copy behavior
      // also allows multi-touch gestures (like pinch-zoom) to occur unabaited
      if (type === "touchstart") {
        if (!event.touches || event.touches.length < 2) {
          e.preventDefault();
        }
      }
      
      // Begin panning
      if (!pan.panning && (
        type === "mousedown" ||
        type === "touchstart" ||
        type === "MozTouchDown"
      )) {
        pan.panning = true;
        pan.x = mousepos.x - 2 * g.origin.x;
        pan.y = mousepos.y - 2 * g.origin.y;
        elem.style.cursor = "move";
        g.queue("panstart");
      }
      
      // Cease panning
      if (pan.panning && (
        type === "mouseup" ||
        type === "touchend" ||
        type === "MozTouchUp" ||
        type === "MozTouchRelease"
      )) {
        
        // cancel tiletap if mouse has moved too far
        var
          diffx = mousepos.x - 2 * g.origin.x - pan.x,
          diffy = mousepos.y - 2 * g.origin.y - pan.y;
        diffx = diffx < 0 ? -diffx : diffx;
        diffy = diffy < 0 ? -diffy : diffy;
        if (diffx > g.tileWidth || diffy > g.tileHeight) {
          downTime = null;
        }
        
        // reorient if panning is still enabled
        if (pan.enabled) {
          g.queue("panend", mousepos.x - pan.x - 2 * g.origin.x, mousepos.y - pan.y - 2 * g.origin.y);
          g.reorient(
            mousepos.x - g.origin.x - pan.x,
            mousepos.y - g.origin.y - pan.y
          );
        }
        
        pan.enabled = true;
        pan.panning = false;
        pan.x = null;
        pan.y = null;
        elem.style.cursor = "";
      }
      
      var
        tiledown = g.events.tiledown,
        tileup = g.events.tileup,
        tileclick = g.events.tileclick,
        tiletap = g.events.tiletap;
      
      // Short-circuit if there are no tiledown, tileup, tileclick or tiletap event handlers
      if (!tiledown && !tileup && !tileclick && !tiletap) {
        g.fire();
        return;
      }
      
      var
        // Adjusted mouse position
        pos = {
          x: mousepos.x - g.origin.x,
          y: mousepos.y - g.origin.y
        },
        
        // Grid-centric coordinates of the latest actioned tile
        trans = g.translate(pos.x, pos.y);
      
      if (
        type === "mousedown" ||
        type === "touchstart" ||
        type === "MozTouchDown"
      ) {
        
        downTime = +new Date();
        
        // Trigger tiledown callbacks
        if (tiledown) {
          g.fire(); // fire any previously queued events
          var res = g.trigger("tiledown", trans.x, trans.y);
          if (res && res.prevented) {
            pan.enabled = false;
          }
        }
        
        // Remember mousedown target (to test for "click" later)
        downTile.x = trans.x;
        downTile.y = trans.y;
        
      } else if (
        type === "mouseup" ||
        type === "touchend" ||
        type === "MozTouchUp" ||
        type === "MozTouchRelease"
      ) {
        
        // Queue up tileup callbacks
        if (tileup) {
          g.queue("tileup", trans.x, trans.y);
        }
        
        // Queue up tileclick and tiletap callbacks
        if (downTile.x === trans.x && downTile.y === trans.y) {
          if (tileclick) {
            g.queue("tileclick", trans.x, trans.y);
          }
          if (tiletap && downTime && (+new Date()) - downTime < g.tapthreshold) {
            g.queue("tiletap", trans.x, trans.y);
          }
        }
        
        // Clear mousedown target
        downTile.x = null;
        downTile.y = null;
        
        // Clear tiledown time
        downTime = null;
        
      }
      
      // Fire off any queued events
      g.fire();
      
    }
    
    // Add DOM event handlers to grid element for mouse movement
    hex.addEvent(elem, "mousedown", mousebutton);
    hex.addEvent(elem, "mouseup", mousebutton);
    hex.addEvent(elem, "touchstart", mousebutton);
    hex.addEvent(elem, "touchend", mousebutton);
    hex.addEvent(elem, "MozTouchDown", mousemove);
    hex.addEvent(elem, "MozTouchUp", mousemove);
    hex.addEvent(elem, "MozTouchRelease", mousemove);
    
    // A mouseup event anywhere on the document outside the grid element while panning should:
    // * cease panning,
    // * fire a gridout event, and
    // * clear the mousedown and lasttile targets
    function mouseup(event) {
      
      // We only care about the mouseup event if the user was panning
      if (!pan.panning) {
        return;
      }
      
      // Reorient the board, and cease panning
      g.reorient(
        parseInt(root.style.left, 10),
        parseInt(root.style.top, 10)
      );
      pan.panning = false;
      pan.x = null;
      pan.y = null;
      elem.style.cursor = "";
      
      // Queue gridout event handlers if applicable
      if (downTile.x !== null && downTile.y !== null && !event.inside(elem)) {
        g.queue("gridout", downTile.x, downTile.y);
      }
      
      // Clear previously set downTile and lastTile coordinates
      downTile.x = null;
      downTile.y = null;
      lastTile.x = null;
      lastTile.y = null;
      
      // Clear tiledown time
      downTime = null;
      
      // Fire off queued events
      g.fire();
      
    }
    hex.addEvent(document, "mouseup", mouseup);
    hex.addEvent(document, "touchend", mouseup);
    hex.addEvent(document, "gesturestart", mouseup);
    hex.addEvent(document, "gesturechange", mouseup);
    hex.addEvent(document, "gestureend", mouseup);
    hex.addEvent(document, "MozTouchUp", mouseup);
    hex.addEvent(document, "MozTouchRelease", mouseup);
    
    // A mousewheel event should be captured, and then reorient up or down the height of a tile
    // @see http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel
    function mousewheel(e) {
      
      var event = e.event;
      
      // short-circuit if the ctrl key is being pressed (zoom)
      if (event.ctrlKey) {
        return;
      }
      
      var
        // did the event happen inside the bounds of the grid element?
        inside = e.inside(elem),
        
        // was it up or down?
        wheelData = event.detail ? event.detail * -1 : event.wheelDelta * 0.025,
        direction = wheelData > 0 ? 1 : wheelData < 0 ? -1 : 0;
      
      // scroll it
      if (inside && direction) {
        e.preventDefault();
        if (event.wheelDeltaX || event.axis && event.axis === event.HORIZONTAL_AXIS) {
          var deltax = g.tileWidth * direction;
          g.queue("panstart");
          g.queue("panmove", deltax, 0);
          g.queue("panend", deltax, 0);
          g.reorient(g.origin.x + deltax, g.origin.y);
        } else {
          var deltay = g.tileHeight * direction;
          g.queue("panstart");
          g.queue("panmove", 0, deltay);
          g.queue("panend", 0, deltay);
          g.reorient(g.origin.x, g.origin.y + deltay);
        }
      }
    }
    hex.addEvent(elem, "mousewheel", mousewheel);
    hex.addEvent(elem, "DOMMouseScroll", mousewheel);
    
    // Perform initialization if grid supports it
    if (g.init) {
      g.init();
    }
    
    return g;
  }
  
});

})(window.hex);

