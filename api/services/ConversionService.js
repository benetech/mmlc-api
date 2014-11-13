module.exports = {
    convert: function(options, done) {
        var mathjaxNode = require("../../node_modules/MathJax-node/lib/mj-single.js"),
            extend = require("extend"),
            mathJaxNodeOptions = extend(options, {timeout: 10 * 1000});

        mathjaxNode.typeset(options, function (data) {
            done(data);
        });
    },

    convertHTML5: function(options, done) {
        var mathjaxNode = require("../../node_modules/MathJax-node/lib/mj-page.js"),
            extend = require("extend"),
            mathJaxNodeOptions = extend(options, {timeout: 10 * 1000});
        mathjaxNode.typeset(options, function (data) {
            done(data);
        });
    }
};