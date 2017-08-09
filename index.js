"use strict";

module.exports = function (container) {
    return {
        dependencies: [],
        *onBeforeComponentsRegister() {
            container.register("aopLogger", require("./lib/aop_logger"));
        }
    }
}
