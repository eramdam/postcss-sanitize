'use strict';

const postcss = require('postcss');
const valueParser = require('postcss-value-parser');
const isRegExp = require('lodash.isregexp');
const isString = require('lodash.isstring');
const _every = require('lodash.every');

const passRule = (rule, decl) => {
  return _every(rule, (val, key) => {
    if (isRegExp(val)) {
      val.lastIndex = 0;
      return val.test(decl[key]);
    } else if (isString(val)) {
      return decl[key] === val;
    }

    return false;
  });
};

const deleteEmptyRules = (rule) => {
  if (rule.nodes.length === 0)
    rule.remove();
};

const cleanURLRE = /^[\s]+/;

const deleteURL = (url, schemes) => {
  const cleanedUrl = url.replace(cleanURLRE, '');
  return !schemes.some((s) => cleanedUrl.indexOf(s) === 0);
};

const startParenthesis = /^\(/;
const endParenthesis = /\)$/;

module.exports = postcss.plugin('postcss-sanitize', (opts) => {
  opts = Object.assign({
    removeEmpty: false,
    rules: []
  }, opts);

  return (css, result) => {
    if (opts.rules.length === 0 && !opts.allowedSchemes)
      result.warn('No rules specified, are you sure you\'re not forgetting something?');

    const rules = opts.rules;

    if (opts.allowedSchemes) {
      css.walkAtRules('import', (rule) => {
        const url = rule.params.replace(startParenthesis, '').replace(endParenthesis, '');
        if (deleteURL(url, opts.allowedSchemes))
          rule.remove();
      });
    }

    css.walkDecls(decl => {
      if (rules.some(rule => passRule(rule, decl)))
        decl.remove();

      if (opts.allowedSchemes) {
        const parsed = valueParser(decl.value);

        parsed.walk((node) => {
          if (node.type === 'function' && node.value === 'url') {
            node.nodes.forEach((urlNode) => {
              if (deleteURL(urlNode.value, opts.allowedSchemes))
                urlNode.value = '';
            });
          }
        });

        decl.value = parsed.toString();
      }
    });

    if (opts.removeEmpty)
      css.walkRules(rule => deleteEmptyRules(rule));
  };
});
