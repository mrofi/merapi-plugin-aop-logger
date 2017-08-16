"use strict";

const { Component, utils, Config } = require("merapi");

module.exports = class AopLogger extends Component {
    constructor(logger) {
        super();
        this.logger = logger;
    }

    logBefore(component, methodName, func, options) {
        return (...args) => {
            this.doLog(options.level || "log", methodName, null, args, options.output);
            return func.apply(component, args);
        }
    }

    log(component, methodName, func, options) {
        return (...args) => {
            let start = Date.now();
            let result = func.apply(component, args);

            if (utils.isPromise(result)) {
                return result.then(res => {
                    let duration = Date.now() - start;
                    this.doLog(options.level || "log", methodName, res, args, options.output, duration);
                    return res;
                })
            }

            let duration = Date.now() - start;
            this.doLog(options.level || "log", methodName, result, args, options.output, duration);
            
            return result;
        }
    }

    doLog(level, methodName, result, args, output, duration) {
        let replaceObject = {
            methodName,
            result,
            params: args,
            duration
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
