"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileManager_1 = require("./FileManager");
const iosConstants_1 = require("./iosConstants");
const entitlementsFileName = `widgets.entitlements`;
class NseUpdaterManager {
    nsePath = '';
    constructor(iosPath) {
        this.nsePath = `${iosPath}/${iosConstants_1.NSE_TARGET_NAME}`;
    }
    async updateNSEEntitlements(groupIdentifier) {
        const entitlementsFilePath = `${this.nsePath}/${entitlementsFileName}`;
        let entitlementsFile = await FileManager_1.FileManager.readFile(entitlementsFilePath);
        entitlementsFile = entitlementsFile.replace(iosConstants_1.GROUPS_ID_TEMPLATE_REGEX, groupIdentifier);
        await FileManager_1.FileManager.writeFile(entitlementsFilePath, entitlementsFile);
    }
}
exports.default = NseUpdaterManager;
