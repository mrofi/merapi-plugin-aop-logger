"use strict";

const { Component, utils, Config } = require("merapi");

module.exports = class AopLogger extends Component {
    constructor(logger) {
        super();
        this.logger = logger;
    }

    log(component, methodName, func, options) {
        return (...args) => {
            let result = func.apply(component, args);
            if (utils.isPromise(result)) {
                return result.then(res => {
                    this.doLog(options.level || "log", methodName, res, args, options.output);
                    return res;
                })
            }
            this.doLog(options.level || "log", methodName, result, args, options.output);
            return result;
        }
    }

    doLog(level, methodName, result, args, output) {
        let replaceObject = {
            methodName,
            result,
            params: args
        };
        if (typeof output == "string") {
            output = output.replace(/\[\w+\]/g, (word) => {
                return replaceObject[word.replace(/\[|\]/g, "")] || word;
            });
        } else {
            let config = Config.create(Object.assign({output:output}, replaceObject),  {left:"$(", right:")", lazy:true, recursive:false});
            output = config.resolve("output");
        }
        this.logger[level](output);
    }
}
