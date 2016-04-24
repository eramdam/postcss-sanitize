# PostCSS Sanitize [![Build Status][ci-img]][ci]

[PostCSS] plugin that removes properties and values based on options (think like a CSS sanitizer).

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/eramdam/postcss-sanitize.svg
[ci]:      https://travis-ci.org/eramdam/postcss-sanitize

## Disclaimer

This package is still not published on NPM because it's not decently documented yet!

## Usage

Let's say you want to do the following things:
+ Remove Comic Sans as a font from your CSS
+ Disallow `position: absolute` or `position: relative`

Options:
```js
removeEmpty: true,
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
.skeleton--Sans {
  color: blue;
  position: absolute;
  font-family: "Comic Sans MS";
}
```

Output:
```css
.skeleton--Sans {
  color: blue;
}
```

## Options

+ `removeEmpty (boolean) (Default: false)`: Decide if you want to CSS rules made empty by the changes
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
- Open a pull request

## License

This project is using the MIT License (see `LICENSE` file for more infos)
