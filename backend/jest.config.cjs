module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  collectCoverageFrom: ['**/*.{js,jsx}', '!**/node_modules/**', '!**/coverage/**', '!**/jest.config.cjs'],
  coverageDirectory: '<rootDir>/coverage',
};
