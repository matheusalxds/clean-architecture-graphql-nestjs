// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config');
config.testMatch = ['**/*.e2e.test.ts'];
module.exports = config;
