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

See [PostCSS] docs for examples for your environment.

## Todo
- [ ] Write documentation
  - [ ] About general usage
  - [ ] About API
