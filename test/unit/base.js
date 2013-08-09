/**
 * base.js
 * Defines utility testings functions above what qunit provides.
 */

/**
 * Executes the provided function, expecting it to throw the specified error.
 * @param func The function to execute.
 * @param error The expected error string (set to null to accept any thrown error).
 * @param msg The string to present to qunit on pass/fail.
 */
function throwing(func, error, msg) {
  var msg = msg + " throws" + ( error ? ' "' + error + '"' : '' ); 
  try {
    func.call(this);
    fail(msg);
  } catch (err) {
    ok(error === null || QUnit.equiv(err, error), msg);
  }
}

