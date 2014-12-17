module.exports = {
    convert: function(options, done) {
        var mathjaxNode = require("../../node_modules/MathJax-node/lib/mj-single.js"),
            extend = require("extend"),
            mathJaxNodeOptions = extend(options, {timeout: 100 * 1000});

        mathjaxNode.typeset(options, function (data) {
            done(data);
        });
    },

    submitHTML5Conversion: function(options, done) {
        var job = jobs.create('html5 conversion', {title: 'Convert math in ' + options.filename, html5Id: options.id}).save(function(err) {
            if (!err) { 
                done();
            } else { 
                console.log(err);
                done({err: err});
            }
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
                    console.log("Errors typesetting page: " + data.errors);
                    done(data.errors);
                } else {
                    //update html5.
                    Html5.update({id: html5.id}, {output: data.html}).exec(function(err, html5s) {
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
                                         EquationService.createComponent(html5.outputFormat, equation.outputJax, dbEquation.id);
                                    });
                                }
                            });
                        }
                        done();
                    });
                }
            });
        } catch (err) {
            done(err);
        }
    }
};