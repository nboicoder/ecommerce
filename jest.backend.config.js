// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/backend/__tests__'],
  testMatch: [
    '**/__tests__/**/*.{js,jsx,ts,tsx}',
    '**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/node_modules/**',
    '!backend/__tests__/**',
    '!backend/config/**',
    '!backend/utils/**'
  ],
  coverageDirectory: '<rootDir>/backend/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/backend/__tests__/setup.js'],
  testTimeout: 15000,
  verbose: true
};