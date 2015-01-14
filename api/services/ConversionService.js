var waterfall = require('async-waterfall'), jsdom = require("jsdom").jsdom, serializeDocument = require("jsdom").serializeDocument; 
module.exports = {
    convert: function(options, done) {
        var mathjaxNode = require("../../node_modules/MathJax-node/lib/mj-single.js"),
            extend = require("extend"),
            mathJaxNodeOptions = extend(options, {timeout: 100 * 1000});

        mathjaxNode.typeset(options, function (data) {
            done(data);
        });
    },

    convertHTML5: function(options, done) {
        var conversionService = this;
        Html5.findOne({ id: options.html5Id }).exec(function(err, html5) {
            if (err) { 
                done(err);
            } else {
                var mathjaxOptions = {};
                mathjaxOptions.html = html5.source;
                mathjaxOptions.speakText = true;
                mathjaxOptions.timeout = 100 * 1000;
                mathjaxOptions.renderer = conversionService.getRenderer(html5.outputFormat);
                mathjaxOptions.equations = true;
                ConversionService.typesetPage(mathjaxOptions, html5, done);
            }
        });
    },

    getRenderer: function(outputFormat) {
        switch (outputFormat) {
            case "svg": 
                return "SVG";
            case "png":
                return "PNG";
            case "mml":
                return "NativeMML";
            default:
                "None";
        }
    },

    typesetPage: function(mathjaxOptions, html5, done) {
        var mathjaxNode = require("../../node_modules/MathJax-node/lib/mj-page.js");
        try {
            mathjaxNode.typeset(mathjaxOptions, function (data) {
                if (typeof(data.errors) != "undefined") {
                    done(data.errors);
                } else {
                    var doc = jsdom(data.html);
                    var window = doc.parentWindow;
                    waterfall([
                        function (callback) {
                            //Save all jax.
                            if (typeof(data.equations) != "undefined") {
                                data.equations.forEach(function(equation, index) {
                                    if (equation.originalText != '') {
                                        Equation.create({
                                        math: equation.originalText,
                                        mathType: equation.inputJax,
                                        html5: html5.id}).exec(function(err, dbEquation) {
                                            if (err) done(err);
                                            //Create output component.
                                            EquationService.createComponent(html5.outputFormat, equation.outputJax, dbEquation.id);
                                            if (window.document.getElementById(equation.inputID) != null) {
                                                var domEquation = window.document.getElementById(equation.inputID);
                                                domEquation.setAttribute("id", dbEquation.id);
                                                var comment = window.document.createComment("https://mathmlcloud.org/equation/" + dbEquation.id);
                                                var parent = domEquation.parentElement;
                                                parent.insertBefore(comment, domEquation);
                                            }
                                        });
                                    }
                                });
                            }
                            callback();
                        },
                        function(callback){
                            //update html5.
                            Html5.update({id: html5.id}, {output: serializeDocument(doc)}).exec(function(err, html5s) {
                                if (err) callback(err);
                            });
                            callback();
                        }
                    ],
                    function(err) {
                        if (err) done(err);
                        done();
                    });
                }
            });
        } catch (err) {
            done(err);
        }
    }
};