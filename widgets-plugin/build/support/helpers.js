"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePluginProps = void 0;
const types_1 = require("../types");
function validatePluginProps(props) {
    // check the type of each property
    if (props.devTeam && typeof props.devTeam !== 'string') {
        throw new Error("Widgets Expo Plugin: 'devTeam' must be a string.");
    }
    // check for extra properties
    const inputProps = Object.keys(props);
    for (const prop of inputProps) {
        if (!types_1.WIDGETS_PLUGIN_PROPS.includes(prop)) {
            throw new Error(`Widgets Expo Plugin: You have provided an invalid property "${prop}" to the Widgets plugin.`);
        }
    }
}
exports.validatePluginProps = validatePluginProps;
