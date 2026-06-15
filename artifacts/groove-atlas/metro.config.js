const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

// Exclude temp directories and removed workspace packages
config.resolver = config.resolver ?? {};
const { blockList: existingBlockList } = config.resolver;
const blockListEntries = [
  /.*_tmp_.*\/cjs$/,
  /.*\/node_modules\/.*_tmp_.*$/,
  /.*\/lib\/api-client-react\/.*/,
  /.*\/lib\/api-spec\/.*/,
];
if (existingBlockList) {
  config.resolver.blockList = Array.isArray(existingBlockList)
    ? [...existingBlockList, ...blockListEntries]
    : [existingBlockList, ...blockListEntries];
} else {
  config.resolver.blockList = blockListEntries;
}

module.exports = config;
