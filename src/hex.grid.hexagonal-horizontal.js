/**
 * hex.grid.hexagonal-horizontal.js
 */
(function (hex, undefined) {

var
  floor = Math.floor;

/**
 * The hexagonal grid with horizontal layout prototype.
 */
hex.grid.hexagonal_horizontal = {

  /**
   * Determine to which quadrant a given screen coordinate pair corresponds.
   * @param posx The horizontal screen coordinate.
   * @param posy The vertical screen coordinate.
   * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
   */
  quadrant: function quadrant(posx, posy) {

    var
      w = this.tileWidth,
      h = this.tileHeight,
      qx = floor(( posx ) / w),
      qy = floor(( posy - h * 0.25 ) / ( h * 0.75 ));

    return {
      x: qx,
      y: qy
    };

  },

  /**
   * Given a pair of hex coordinates, calculates the appropriate screen position.
   * @param hexx The horizontal hexagonal grid coordinate (30 degrees up from vertical).
   * @param hexy The "vertical" hexagonal grid coordinate.
   * @return An object with an x and y property, mapping to the actual screen coordinates.
   */
  screenpos: function screenpos(hexx, hexy) {

    var
      w = this.tileWidth ,
      h = this.tileHeight * 0.75,
      sx = -hexx * w - hexy * w * 0.5,
      sy = hexy * h;

    return {
      x: sx,
      y: sy
    };

  },

  /**
   * Hexagon tile characteristics.
   */
  tileHeight: 48,
  tileWidth: 42,

  /**
   * Translate a pair of x/y screen coordinates into the geometry appropriate coordinates of this grid.
   * @param posx The horizontal screen coordinate.
   * @param posy The vertical screen coordinate.
   * @return An object with an x and y property, mapping to the geometry appropriate coordinates of the grid.
   */
  translate: function translate(posx, posy) {

    // Useful shorthand values
    var
      h2 = this.tileHeight * 0.5,
      h4 = h2 * 0.5,
      h34 = h4 * 3,
      w = this.tileWidth,
      w2 = w * 0.5,
      m = w2 / h4,
      x,
      y;

    // Determine the "quadrant" in which the click occurred (there are two types, as discussed later)
    var
      q = this.quadrant(posx, posy),
      qx = q.x,
      qy = q.y;

    // Based on the quadrant, calculate the pixel offsets of the click within the quadrant
    var
      py = (posy - h4) % h34,
      px = ( posx ) % w;
    if (py < 0) {
      py += h34;
    }
    if (px < 0) {
      px += w;
    }
    py -= h2;

    // Mode determined by x quadrant
    if (qy % 2) {

      // |_/|  A-type quadrant
      // | \|

      // Start with simple cases
      y = qy;
      x = (1 - qy) * 0.5 - qx - (px > w2 ? 1 : 0);
      if (py <= 0 || px === w2) {
        return {
          x: x,
          y: y
        };
      }

      // Make adjustments if click happened in right-hand third of the quadrant
      if (px < w2 && px > ( w2 - py * m)) {
        return {
          y: y + 1,
          x: x - 1
        };
      }
      if (px > w2 && px < (w2 + py * m)) {
        return {
          y: y + 1,
          x: x
        };
      }

    } else {

      // | \|  B-type quadrant
      // | /|

      // Start with simple case
      y = qy;
      x = -qy * 0.5 - qx;
      if (py <= 0 || px === w2) {
        return {
          x: x,
          y: y
        };
      }

      // Make adjustments if the click happened in the latter third
      if (px < w2 && px < py * m) {
        return {
          y: y + 1,
          x: x
        };
      }
      if (px > w2 && px > (w - py * m)) {
        return {
          y: y + 1,
          x: x - 1
        };
      }
    }

    // fall through case - no adjustments necessary
    return {
      x: x,
      y: y
    };

  }

};

})(window.hex);
