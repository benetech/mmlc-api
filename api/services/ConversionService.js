module.exports = {

    convert: function(options, done) {
        var mathjaxNode = require("../../node_modules/MathJax-node/lib/mj-single.js"),
            mathjaxNodePage = require("../../node_modules/MathJax-node/lib/mj-page.js"),
            extend = require("extend"),
            mathJaxNodeOptions = extend(options, {img:false, mml:true, timeout: 10 * 1000});

        mathjaxNode.typeset(options, function (data) {
            done(data);
        });
    }
};