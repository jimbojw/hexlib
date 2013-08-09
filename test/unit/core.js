/**
 * core.js
 * Tests for hex.core.js functionality.
 */

// Enable debug logging
hex.debug = true;

module("core");

test("base library", function() {
  expect(1);
  ok(window.hex, "window.hex");
});

test("hex.extend()", function() {
  expect(2);
  var x = { a: 1 };
  equal(x, hex.extend(x), "obj === hex.extend(obj)");
  hex.extend(x, {b:2});
  equal(QUnit.equiv(x, {a:1, b:2}), true, "Extended object equivalence");
});

test("hex.create()", function() {
  expect(7);
  ok(hex.create, "hex.create");
  throwing(function() {
    hex.create();
  }, "no parent supplied", "hex.create()");
  var
    has = Object.prototype.hasOwnProperty,
    parent = { property: "value" },
    child = hex.create(parent),
    sibling = hex.create(parent, { other: "other" });
  ok(child.property, "child.property");
  equal(has.call(child, "property"), false, "child.hasOwnProperty('property')");
  equal(parent.property, child.property, "parent.property === child.property");
  equal(child.property, sibling.property, "child.property === sibling.property");
  equal(has.call(sibling, "other"), true, "sibling.hasOwnProperty('other')");
});

test("hex.key()", function() {
  expect(4);
  ok(hex.key, "hex.key");
  equal(hex.key(), "", "hex.key()===''");
  equal(hex.key(1), "1", "hex.key(1)==='1'");
  equal(hex.key(1, -2), "1,-2", "hex.key(1, -2)==='1,-2'");
});

