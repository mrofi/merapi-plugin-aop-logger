# Merapi Plugin: AOP Logger

## Introduction

This plugin will add logger handler method for `merapi-plugin-aop`.

## Installation

Add plugin to dependency list in `package.json`

```
npm install merapi-plugin-aop-logger --save
```

## Configuration

```
{
    name: "gogon-service",
    version: "1.0.0",
    plugins: [
        "aop"
        "aop-logger"
    ],
    aspects: {
        logging: {
            handler: aopLogger.logMethod,
            match: "*.*",
            options: {
                output: "test log [methodName]: [params] [result]"
            }
        }
    }
}
```

`aop-logger` handler is aopLogger.logMethod with `methodName`, `params`, and `result` as available placeholder variable.
