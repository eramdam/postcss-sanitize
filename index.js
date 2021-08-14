"use strict";

const valueParser = require("postcss-value-parser");
const isRegExp = require("lodash.isregexp");

const passRule = (rule, decl) => {
  return Object.entries(rule).every(([key, val]) => {
    if (isRegExp(val)) {
      val.lastIndex = 0;
      return val.test(decl[key]);
    } else if (typeof val === "string") {
      return decl[key] === val;
    }

    return false;
  });
};

const deleteEmptyRules = rule => {
  if (rule.nodes.length === 0) {
    rule.remove();
  }
};

const cleanURLRE = /^\s+/;

const deleteURL = (url, schemes) => {
  let cleanedUrl = url.replace(cleanURLRE, "");
  return !schemes.some(s => cleanedUrl.indexOf(s) === 0);
};

const startParenthesis = /^\(/;
const endParenthesis = /\)$/;

module.exports = opts => {
  opts = Object.assign(
    {
      removeEmpty: false,
      rules: []
    },
    opts
  );

  return {
    postcssPlugin: "postcss-sanitize",
    Once(css, { result }) {
      if (opts.rules.length === 0 && !opts.allowedSchemes) {
        result.warn(
          "No rules specified, are you sure you're not forgetting something?"
        );
      }

      let rules = opts.rules;

      if (opts.allowedSchemes) {
        css.walkAtRules("import", rule => {
          let url = rule.params
            .replace(startParenthesis, "")
            .replace(endParenthesis, "");
          if (deleteURL(url, opts.allowedSchemes)) {
            rule.remove();
          }
        });
      }

      css.walkDecls(decl => {
        if (rules.some(rule => passRule(rule, decl))) {
          decl.remove();
        }

        if (opts.allowedSchemes) {
          let parsed = valueParser(decl.value);

          parsed.walk(node => {
            if (node.type === "function" && node.value === "url") {
              node.nodes.forEach(urlNode => {
                if (deleteURL(urlNode.value, opts.allowedSchemes)) {
                  urlNode.value = "";
                }
              });
            }
          });

          decl.value = parsed.toString();
        }
      });

      if (opts.removeEmpty) {
        css.walkRules(rule => deleteEmptyRules(rule));
      }
    }
  };
};

module.exports.postcss = true;
