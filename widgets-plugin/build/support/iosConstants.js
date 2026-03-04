"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NSE_EXT_FILES = exports.NSE_SOURCE_FILE = exports.NSE_TARGET_NAME = exports.GROUPS_ID_TEMPLATE_REGEX = exports.DEFAULT_BUNDLE_SHORT_VERSION = exports.DEFAULT_BUNDLE_VERSION = exports.SWIFT_VERSION = exports.TARGETED_DEVICE_FAMILY = exports.IPHONEOS_DEPLOYMENT_TARGET = void 0;
exports.IPHONEOS_DEPLOYMENT_TARGET = '16.0';
exports.TARGETED_DEVICE_FAMILY = `"1,2"`;
exports.SWIFT_VERSION = '5.0';
exports.DEFAULT_BUNDLE_VERSION = '1';
exports.DEFAULT_BUNDLE_SHORT_VERSION = '1.0';
exports.GROUPS_ID_TEMPLATE_REGEX = /{{GROUP_IDENTIFIER}}/gm;
exports.NSE_TARGET_NAME = 'widgets';
exports.NSE_SOURCE_FILE = 'WidgetsBundle.swift';
exports.NSE_EXT_FILES = [
    `${exports.NSE_TARGET_NAME}.entitlements`,
    `${exports.NSE_TARGET_NAME}-Info.plist`,
];
