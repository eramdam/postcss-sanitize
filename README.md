# PostCSS Sanitize [![Build Status][ci-img]][ci] [![David](https://img.shields.io/david/eramdam/postcss-sanitize.svg)]()

[![npm](https://img.shields.io/npm/v/postcss-sanitize.svg)](https://www.npmjs.com/package/postcss-sanitize)
[![npm](https://img.shields.io/npm/l/postcss-sanitize.svg)](https://www.npmjs.com/package/postcss-sanitize)

[PostCSS] plugin that removes properties and values based on options (think like a CSS sanitizer).


## Installation

```bash
npm install postcss-sanitize
```

## Usage

Let's say you want to do the following things:
+ Remove Comic Sans as a font from your CSS
+ Disallow `position: absolute` or `position: relative`

Options:
```js
removeEmpty: true,
allowedSchemes: ['http', 'https']
rules: [{
  prop: /font/gi,
  value: /Comic Sans/gi
}, {
  prop: 'position',
  value: /relative|absolute/
}]
```

Input:
```css
@import(ssh://foobar.host);

.skeleton--Sans {
  color: blue;
  position: absolute;
  font-family: "Comic Sans MS";
}

.the-real-slim-shady-element {
  background-image: url(javascript:alert(42));
}
```

Output:
```css
.skeleton--Sans {
  color: blue;
}

.the-real-slim-shady-element {
  background-image: url();
}
```

## Options

+ `removeEmpty (boolean) (Default: false)`: Decide if you want to CSS rules made empty by the changes
+ `allowedSchemes`: An array of URL schemes you want to allow in your CSS.
+ `rules (array)`: rules
  - `prop (RegExp/string)`: the pattern or the **exact** string you want to match in properties
  - `value (RegExp/string)`: the pattern or the **exact** string you want to match in values
  - **Important** When using both, a property/value couple have to match both the property and the value pattern to be matched and removed.

See [PostCSS] docs for examples for your environment.

## Contribute

You will need at least Node 5.x.

- Fork
- Install the dependencies
- Hack around
- Make sure tests are passing or add some if needed
- Open a pull request :tada:

## License

This project is using the MIT License (see `LICENSE` file for more infos)


[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/eramdam/postcss-sanitize.svg
[ci]:      https://travis-ci.org/eramdam/postcss-sanitize
