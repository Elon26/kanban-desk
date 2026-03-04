"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./support/helpers");
const withWidgetsIOS_1 = require("./withWidgetsIOS");
const withWidgets = (config, props) => {
    // if props are undefined, throw error
    if (!props) {
        throw new Error('You are trying to use the utoFillCredentialProvider plugin without any props.');
    }
    (0, helpers_1.validatePluginProps)(props);
    config = (0, withWidgetsIOS_1.withWidgetsIos)(config, props);
    return config;
};
exports.default = withWidgets;
