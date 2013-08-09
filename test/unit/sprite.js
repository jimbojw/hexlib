/**
 * sprite.js
 * Tests for hex.sprite.js functionality.
 */

module("sprite");

test("hex.spritemap()", function() {
  
  expect(2);
  
  // Basic availability
  ok(hex.spritemap, "hex.spritemap");
  
  // Throws when missing required fields
  throwing(function() {
    hex.spritemap();
  }, "no options hash was supplied", "hex.spritemap()");
  
});

test("hex.spritemap(options)", function() {
  
  expect(3);
  
  // Create a basic sprite map with simple animation
  var spritemap = hex.spritemap({
    url: "../graphics/sprite/simple-hex-sprites-48x42.png",
    width: 48,
    height: 42,
    map: {
      "white-hex": [0, 0],
      "black-hex": [1, 0],
      "gray-hex": [2, 0],
      "white-circle": [3, 0],
      "black-circle": [4, 0],
      "gray-circle": [5, 0],
      "star": [0, 1, 6]
    }
  });
  ok(spritemap, "hex.spritemap(options)");
  
  var container = document.getElementById('sprite-test');
  
  // Test creating a layered sprite
  var sprite = spritemap.sprite("black-hex", "gray-circle", "star");
  ok(sprite, "spritemap.sprite(layers)");
  container.appendChild(sprite.base);
  
  // Test animating a sprite
  sprite = spritemap.sprite("gray-hex", "white-circle", "star");
  ok(sprite, "spritemap.sprite(layers)");
  container.appendChild(sprite.base);
  
  // Animate!
  sprite.layers[2].animate({
    repeat: true
  });
  setTimeout(function() {
    sprite.layers[2].stop();
  }, 5000);
  
});


