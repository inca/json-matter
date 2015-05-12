# JSON front matter

Extracts JSON front-matter from strings or serializes it back.

## What's "front matter"?

**Front matter** is an easy, fast and reliable way to attach arbitrary
complex meta-data to virtually any string file (HTML, Markdown, Rho, anything).

AFAIK, _front matter_ is a term coined in [Jekyll](http://jekyllrb.com/).

JSON front matter is as simple as having a JSON at the start of your string,
followed by arbitrary content like this:

```json
{
  "foo": "bar",
}

Then comes rest content.
```

This string is parsed into following object:

```json
{
  "foo": "bar",
  "__content__": "Then comes rest content."
}
```

And that's it. You can customize the `__content__` name and provide custom
regular expressions so that you can add delimiters or decorators like these:

```
{{{ "my_object": 123 }}}

---

Rest content here.
```

See [tests](https://github.com/inca/json-matter/tree/master/test) for more examples.

## Usage

Install with npm:

```bash
npm i json-matter
```

Require module: 

```js
var fm = require('json-matter');
```

Parse some string:

```js
var obj = fm.parse(string);
```

Serialize it back:

```js
fm.serialize(obj);
```

## Default format

By default we expect indented JSON (e.g. `JSON.stringify(obj, null, 2)`),
so that we could use blazing fast regex to only look for right closing brace
on line start to capture the JSON. Furthermore, blank lines between JSON and
rest content are eliminated.

This behavior is totally configurable: just pass a `regex` option to `parse`
and specify custom regex to capture the JSON part and to clean any delimiters
and other garbage from the rest content.

See [tests(https://github.com/inca/json-matter/tree/master/test) for some examples.

## Implementation notes

Parser is forgiving to bad or missing front matter, returning an object with
`__content__` property equaling to unmodified content.

No I/O included in this library. If you want to parse text file,
just use `fs.readFile` and then parse it.

This library is totally usable in browser via [Browserify](http://browserify.org).

## License

Boris Okunskiy / ISC
