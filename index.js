'use strict';

const postcss = require('postcss');
const _ = require('lodash');

const passRule = (rule, decl) => {
  return _.every(rule, (val, key) => {
    if (_.isRegExp(val)) {
      val.lastIndex = 0;
      return val.test(decl[key]);
    } else if (_.isString(val)) {
      return decl[key] === val;
    }

    return false;
  });
};

const deleteEmptyRules = (rule) => {
  if (rule.nodes.length === 0)
    rule.remove();
};

module.exports = postcss.plugin('postcss-sanitize', (opts) => {
  opts = Object.assign({
    removeEmpty: false,
    rules: []
  }, opts);

  return (css, result) => {
    if (opts.rules.length === 0)
      result.warn('No rules specified, are you sure you\'re not forgetting something?');

    const rules = opts.rules;

    css.walkDecls(decl => {
      if (rules.some(rule => passRule(rule, decl))) {
        decl.remove();
      }
    });

    if (opts.removeEmpty)
      css.walkRules(rule => deleteEmptyRules(rule));
  };
});
