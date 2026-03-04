'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.withWidgetsIos = void 0;
const config_plugins_1 = require('@expo/config-plugins');
const assert_1 = __importDefault(require('assert'));
const fs = __importStar(require('fs'));
const path = __importStar(require('path'));
const NseUpdaterManager_1 = __importDefault(require('./NseUpdaterManager'));
const getEasManagedCredentialsConfigExtra_1 = __importDefault(
  require('./support/eas/getEasManagedCredentialsConfigExtra')
);
const FileManager_1 = require('./support/FileManager');
const iosConstants_1 = require('./support/iosConstants');
const WidgetsLog_ts_1 = require('./support/WidgetsLog.ts');
const withAppEnvironment = (config) => {
  return (0, config_plugins_1.withEntitlementsPlist)(config, (newConfig) => {
    newConfig.modResults['aps-environment'] = 'development';
    return newConfig;
  });
};
const withEasManagedWidgets = (config) => {
  (0, assert_1.default)(
    config.ios?.bundleIdentifier,
    "Missing 'ios.bundleIdentifier' in app config."
  );
  config.extra = (0, getEasManagedCredentialsConfigExtra_1.default)(config);
  return config;
};
const withWidgetsNSE = (config) => {
  const pluginDir = require.resolve('../jest.config.js');
  const sourceDir = path.join(pluginDir, '../build/serviceExtensionFiles/');
  return (0, config_plugins_1.withDangerousMod)(config, [
    'ios',
    async (config) => {
      const iosPath = path.join(config.modRequest.projectRoot, 'ios');
      /* COPY OVER EXTENSION FILES */
      fs.mkdirSync(`${iosPath}/${iosConstants_1.NSE_TARGET_NAME}`, {
        recursive: true,
      });
      fs.cpSync(
        `${sourceDir}Assets.xcassets`,
        `${iosPath}/${iosConstants_1.NSE_TARGET_NAME}/Assets.xcassets`,
        { recursive: true }
      );
      const SWIFT_FILES =
        await FileManager_1.FileManager.getSwiftFiles(sourceDir);
      const ALL_FILES = [...SWIFT_FILES, ...iosConstants_1.NSE_EXT_FILES];
      for (let i = 0; i < ALL_FILES.length; i++) {
        //@ts-ignore
        const extFile = ALL_FILES[i];
        const targetFile = `${iosPath}/${iosConstants_1.NSE_TARGET_NAME}/${extFile}`;
        await FileManager_1.FileManager.copyFile(
          `${sourceDir}${extFile}`,
          targetFile
        );
      }
      const nseUpdater = new NseUpdaterManager_1.default(iosPath);
      await nseUpdater.updateNSEEntitlements(
        `group.${config.ios?.bundleIdentifier}.widget`
      );
      return config;
    },
  ]);
};
const withWidgetsXcodeProject = (config, props) => {
  const pluginDir = require.resolve('../jest.config.js');
  const sourceDir = path.join(pluginDir, '../build/serviceExtensionFiles/');
  return (0, config_plugins_1.withXcodeProject)(config, async (newConfig) => {
    const xcodeProject = newConfig.modResults;
    if (xcodeProject.pbxTargetByName(iosConstants_1.NSE_TARGET_NAME)) {
      WidgetsLog_ts_1.WidgetsLog.log(
        `${iosConstants_1.NSE_TARGET_NAME} already exists in project. Skipping...`
      );
      return newConfig;
    }
    const SWIFT_FILES =
      await FileManager_1.FileManager.getSwiftFiles(sourceDir);
    const ALL_FILES = [...SWIFT_FILES, ...iosConstants_1.NSE_EXT_FILES];
    // Create new PBXGroup for the extension
    const extGroup = xcodeProject.addPbxGroup(
      [...ALL_FILES, iosConstants_1.NSE_SOURCE_FILE, 'Assets.xcassets'],
      iosConstants_1.NSE_TARGET_NAME,
      iosConstants_1.NSE_TARGET_NAME
    );
    // Add the new PBXGroup to the top level group. This makes the
    // files / folder appear in the file explorer in Xcode.
    const groups = xcodeProject.hash.project.objects['PBXGroup'];
    Object.keys(groups).forEach(function (key) {
      if (
        typeof groups[key] === 'object' &&
        groups[key].name === undefined &&
        groups[key].path === undefined
      ) {
        xcodeProject.addToPbxGroup(extGroup.uuid, key);
      }
    });
    // WORK AROUND for codeProject.addTarget BUG
    // Xcode projects don't contain these if there is only one target
    // An upstream fix should be made to the code referenced in this link:
    //   - https://github.com/apache/cordova-node-xcode/blob/8b98cabc5978359db88dc9ff2d4c015cba40f150/lib/pbxProject.js#L860
    const projObjects = xcodeProject.hash.project.objects;
    projObjects['PBXTargetDependency'] =
      projObjects['PBXTargetDependency'] || {};
    projObjects['PBXContainerItemProxy'] =
      projObjects['PBXTargetDependency'] || {};
    // Add the NSE target
    // This adds PBXTargetDependency and PBXContainerItemProxy for you
    const nseTarget = xcodeProject.addTarget(
      iosConstants_1.NSE_TARGET_NAME,
      'app_extension',
      iosConstants_1.NSE_TARGET_NAME,
      `${config.ios?.bundleIdentifier}.${iosConstants_1.NSE_TARGET_NAME}`
    );
    // Add build phases to the new target
    xcodeProject.addBuildPhase(
      [...SWIFT_FILES],
      'PBXSourcesBuildPhase',
      'Sources',
      nseTarget.uuid
    );
    xcodeProject.addBuildPhase(
      ['Assets.xcassets'],
      'PBXResourcesBuildPhase',
      'Resources',
      nseTarget.uuid
    );
    xcodeProject.addBuildPhase(
      ['SwiftUI.framework', 'WidgetKit.framework'],
      'PBXFrameworksBuildPhase',
      'Frameworks',
      nseTarget.uuid
    );
    // Edit the Deployment info of the new Target, only IphoneOS and Targeted Device Family
    // However, can be more
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      if (
        typeof configurations[key].buildSettings !== 'undefined' &&
        configurations[key].buildSettings.PRODUCT_NAME ===
          `"${iosConstants_1.NSE_TARGET_NAME}"`
      ) {
        const buildSettingsObj = configurations[key].buildSettings;
        buildSettingsObj.DEVELOPMENT_TEAM = props?.devTeam;
        buildSettingsObj.SWIFT_VERSION = iosConstants_1.SWIFT_VERSION;
        buildSettingsObj.IPHONEOS_DEPLOYMENT_TARGET =
          iosConstants_1.IPHONEOS_DEPLOYMENT_TARGET;
        buildSettingsObj.TARGETED_DEVICE_FAMILY =
          iosConstants_1.TARGETED_DEVICE_FAMILY;
        buildSettingsObj.CODE_SIGN_ENTITLEMENTS = `${iosConstants_1.NSE_TARGET_NAME}/${iosConstants_1.NSE_TARGET_NAME}.entitlements`;
        buildSettingsObj.CODE_SIGN_STYLE = 'Automatic';
      }
    }
    // Add development teams to both your target and the original project
    xcodeProject.addTargetAttribute(
      'DevelopmentTeam',
      props?.devTeam,
      nseTarget
    );
    xcodeProject.addTargetAttribute('DevelopmentTeam', props?.devTeam);
    return newConfig;
  });
};
const withWidgetsIos = (config, props) => {
  config = withAppEnvironment(config, props);
  config = withWidgetsNSE(config, props);
  config = withWidgetsXcodeProject(config, props);
  config = withEasManagedWidgets(config, props);
  return config;
};
exports.withWidgetsIos = withWidgetsIos;
