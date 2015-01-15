var waterfall = require('async-waterfall'), jsdom = require("jsdom").jsdom, serializeDocument = require("jsdom").serializeDocument; 
module.exports = {

    convertEquation: function(options, equation, host, done) {
        ConversionService.convert(options, function(data) {
            if (typeof(data.errors) == 'undefined') {
                //clean up any old components.
                Component.destroy({equation:equation.id}).exec(function(err, components) {
                    if (err) return done(err);
                    //Save all components.
                    if (options.mml) EquationService.createComponent("mml", data.mml, equation.id);
                    if (options.svg) EquationService.createComponent("svg", data.svg, equation.id);
                    if (options.png) {
                        var pngSource = "<img src=\"" + data.png + "\" alt=\"" + data.speakText + "\" />";
                        EquationService.createComponent("png", pngSource, equation.id);
                    } 
                    if (options.speakText) EquationService.createComponent("description", data.speakText, equation.id);
                    //Look up equation so that we have all created info.
                    Equation.findOne(equation.id).populate('components').exec(function(err, newEquation) {
                        newEquation.cloudUrl = "http://" + host + "/equation/" + equation.id;
                        return done(null, newEquation);
                    });
                });
                
            } else {
                console.log(data.errors);
                return done(data.errors);
            }
        });
    },

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
                                            EquationService.createComponent("description", equation.speakText, dbEquation.id);
                                            if (window.document.getElementById(equation.inputID) != null) {
                                                var domEquation = window.document.getElementById(equation.inputID);
                                                domEquation.setAttribute("id", dbEquation.id);
                                                var comment = window.document.createComment("http://mathml-cloud.cloudapp.net/equation/" + dbEquation.id);
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