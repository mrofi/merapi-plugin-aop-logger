"use strict";

const { Component, utils } = require("merapi");

module.exports = class AopLogger extends Component {
    constructor(logger) {
        super();
        this.logger = logger;
    }

    *logMethod(component, methodName, func, options) {
        let output = options.output;
        return function* (...args) {
            let result;
            if (utils.isPromise(func)) {
                result = yield func(...args);
            } else {
                result = func(...args);
            }

            let replaceObject = {
                                    methodName,
                                    result,
                                    params: args
                                };
            output = output.replace(/\[\w+\]/g, (word) => {
                return replaceObject[word.replace(/\[|\]/g, "")] || word;
            });

            this.logger(output);
            return result;
        }
    }
}
