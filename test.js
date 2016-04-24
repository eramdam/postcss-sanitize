const postcss = require('postcss');
const test = require('ava');
const plugin = require('./index');


function run(t, input, output, opts = { }) {
  return postcss([ plugin(opts) ]).process(input)
        .then( result => {
          t.is(result.css, output);
          t.is(result.warnings().length, 0);
        });
}

test('should remove properties that match a regex', t => {
  const input =
  `body {
      font-family: 'Helvetica';
      fOnt-size: 'Helvetica';
   }`;

  const output =
  `body {
   }`;

  const opts = {
    rules: [{
      prop: /font/gi
    }]
  };

  return run(t, input, output, opts);
});

test('should remove properties that match a string', t => {
  const input =
  `body {
      font-family: 'Helvetica';
    }`;

  const output =
  `body {
    }`;

  const opts = {
    rules: [{
      prop: 'font-family'
    }]
  };

  return run(t, input, output, opts);
});

test('should remove empty CSS rules after cleaning', t => {
  const input = `body {
      font-family: 'Helvetica';
    }`;

  const output = '';

  const opts = {
    removeEmpty: true,
    rules: [{
      prop: 'font-family'
    }]
  };

  return run(t, input, output, opts);
});

test('should remove declarations when both property AND value match', t => {
  const input = `.skeleton--Sans {
      font-family: 'Comic Sans';
      position: absolute;
      position: fixed;
    }`;

  const output = '';

  const opts = {
    removeEmpty: true,
    rules: [{
      prop: 'font-family',
      value: /Comic Sans/gi
    }, {
      prop: 'position',
      value: /absolute|fixed/
    }]
  };

  return run(t, input, output, opts);
});
