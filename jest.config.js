const tsPreset = require('ts-jest/jest-preset');
const baserunPreset = require('baserun/jest-preset');
const dotenv = require("dotenv")

dotenv.config()

const config = {
  ...tsPreset,
  ...baserunPreset,
  testTimeout: 100000,
};

module.exports = config