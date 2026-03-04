"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetsLog = void 0;
class WidgetsLog {
    static log(str) {
        console.log(`\twidgets-expo-plugin: ${str}`);
    }
    static error(str) {
        console.error(`\twidgets-expo-plugin: ${str}`);
    }
}
exports.WidgetsLog = WidgetsLog;
