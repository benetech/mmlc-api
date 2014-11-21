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
            if (typeof(data.errors) != "undefined") done({errors: data.errors});
            //Save HTML5. 
            Html5.create({source: options.html, output: data.html, filename: options.filename, outputFormat: options.renderer}).exec(function(err, html5) {
                if (err) {
                    console.log(err);
                    done({errors: err});
                } else {
                    //Save all jax.
                    if (typeof(data.equations) != "undefined") {
                        data.equations.forEach(function(equation, index) {
                            if (equation.originalText != '') {
                                Equation.create({
                                    math: equation.originalText,
                                    mathType: equation.inputJax,
                                    html5: html5.id}).exec(function(err, dbEquation) {
                                     if (err) console.log(err);
                                     //Create output component.
                                     EquationService.createComponent("mml", equation.outputJax, dbEquation.id);
                                });
                            }
                        });
                    }
                    done(html5);
                }
            });
        });
    }
};