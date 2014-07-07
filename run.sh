#!/usr/bin/env bash

PATH=./node_modules/.bin:$PATH

cd $(dirname $0)

echo Starting Mathoid...
cd mathoid
phantomjs main.js >/dev/null&

echo Starting MathML Cloud...
cd ..
sails lift >/dev/null&
