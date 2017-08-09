"use strict";

const { Component, utils } = require("merapi");

module.exports = class AopLogger extends Component {
    constructor(logger) {
        super();
        this.logger = logger;
    }

    log(component, methodName, func, options) {
        return function (...args) {
            let result = func.apply(component, args);
            if (utils.isPromise(result)) {
                return result.then(res => {
                    this.doLog(methodName, res, args, options.output);
                    return res;
                })
            }
            this.doLog(methodName, result, args, options.output);
            return result;
        }
    }

    doLog(methodName, result, args, output) {
        let replaceObject = {
                                methodName,
                                result,
                                params: args
                            };
        output = output.replace(/\[\w+\]/g, (word) => {
            return replaceObject[word.replace(/\[|\]/g, "")] || word;
        });
        this.logger.info(output);
    }
}
