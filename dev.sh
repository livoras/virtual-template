#!/bin/sh

NODE_ENV=dev nodemon --watch lib --watch test --watch index.js --exec npm test
