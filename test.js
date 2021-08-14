/* eslint-disable no-useless-escape */
const postcss = require("postcss");
const test = require("ava");

const plugin = require("./index");

function run(t, input, output, opts = {}) {
  return postcss([plugin(opts)])
    .process(input, { from: undefined })
    .then(result => {
      t.is(result.css, output);
      t.is(result.warnings().length, 0);
    });
}

test("should remove properties that match a regex", t => {
  let input = `body {
      font-family: 'Helvetica';
      fOnt-size: 'Helvetica';
   }`;

  let output = `body {
   }`;

  let opts = {
    rules: [
      {
        prop: /font/gi
      }
    ]
  };

  return run(t, input, output, opts);
});

test("should remove properties that match a string", t => {
  let input = `body {
      font-family: 'Helvetica';
    }`;

  let output = `body {
    }`;

  let opts = {
    rules: [
      {
        prop: "font-family"
      }
    ]
  };

  return run(t, input, output, opts);
});

test("should remove empty CSS rules after cleaning", t => {
  let input = `body {
      font-family: 'Helvetica';
    }`;

  let output = "";

  let opts = {
    removeEmpty: true,
    rules: [
      {
        prop: "font-family"
      }
    ]
  };

  return run(t, input, output, opts);
});

test("should remove declarations when both property AND value match", t => {
  let input = `.skeleton--Sans {
      font-family: 'Comic Sans';
      position: absolute;
      position: fixed;
    }`;

  let output = "";

  let opts = {
    removeEmpty: true,
    rules: [
      {
        prop: "font-family",
        value: /comic sans/gi
      },
      {
        prop: "position",
        value: /absolute|fixed/
      }
    ]
  };

  return run(t, input, output, opts);
});

test("should remove declarations and @import based on URLs schemes", t => {
  let input = `
  @import(ftp://apple.com/index.css);

  .shady-Element {
      background: url(   ftp://shady.js);
      background: url( ssh://hacker@hax0r.se);
      background: url(\\\javascript:alert('pwned'));
      background: url();
      background: url(///data:aGVsbG8=);
      background: url(http://image.cool/cat.png);
      background: rgb(0,0,0);
    }`;

  let output = `
  .shady-Element {
      background: url(   );
      background: url( );
      background: url());
      background: url();
      background: url();
      background: url(http://image.cool/cat.png);
      background: rgb(0,0,0);
    }`;

  let opts = {
    removeEmpty: true,
    rules: [],
    allowedSchemes: ["http", "https"]
  };

  return run(t, input, output, opts);
});
