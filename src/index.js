'use strict';

var DEFAULT_REGEX = /^(\{[\s\S]*?\n\})(\s*\n)*/;

/**
 * Parses JSON front matter from specified `string`, returning the object itself
 * augmented with `__content__` property (this name is configurable via `alias` option)
 * where the rest content resides.
 *
 * By default it parses indented JSON (such as the one you get via
 * `JSON.stringify(myobj, null, 2)`, so it only looks for a single closing
 * right brace sitting on the line start.
 * The rest content can be delimited from JSON using arbitrary
 * number of blank lines.
 *
 * Options:
 *
 *  * `alias` — variable name to assign text content to (default is `__content__`)
 *  * `regex` — regex for capturing the JSON object and stripping it away
 *    from the rest content; the first capturing group should enclose the JSON object
 *    (default is `^(\{[\s\S]*?\n\})(?:\s*\n)*`)
 *
 * @param {String} string — input string
 * @param {*} options — options described above
 */
exports.parse = function (string, options) {
  options = options || {};
  // configurables
  var regex = options.regex || DEFAULT_REGEX;
  var alias = options.alias || '__content__';
  // parse it like a pro
  var result = {};
  string = string.replace(regex, function (match, json) {
    try {
      result = JSON.parse(json);
      return '';
    } catch (e) {
      return match;
    }
  });
  result[alias] = string;
  return result;
};

/**
 * Reverse parse: removes `__content__` property from the `object` and emits it
 * as indented JSON; then appends the `__content__` property to resulting string
 * with optional delimiter specified via `delimiter` options (by default a single
 * blank line is inserted).
 *
 * Options are:
 *
 *  * `alias` — variable name containing the rest content
 *    (default is `__content__`, like in `parse`)
 *  * `delimiter` — a string to insert between JSON and rest content
 *    (default is `\n\n`)
 *
 * @param {*} object — object to serialize;
 * @param {*} options — options described above
 */
exports.serialize = function (object, options) {
  options = options || {};
  // configurable
  var delimiter = options.delimiter || '\n\n';
  var alias = options.alias || '__content__';
  // Extract the content
  var content = object[alias] || '';
  // Properties are copied onto the new object to prevent side-effects
  var obj = {};
  Object.keys(object).forEach(function (key) {
    if (key != alias)
      obj[key] = object[key];
  });
  // Write them
  return JSON.stringify(obj, null, 2) + delimiter + content;
};
