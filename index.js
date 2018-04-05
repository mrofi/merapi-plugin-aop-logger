"use strict";

module.exports = function (container) {
    return {
        dependencies: [],
        *onAfterPluginInit() {
            container.register("aopLogger", require("./lib/aop_logger"));
        }
    }
}
