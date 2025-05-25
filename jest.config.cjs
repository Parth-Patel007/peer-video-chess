// jest.config.cjs
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // <-- must match exactly

  moduleFileExtensions: ['ts','tsx','js','jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
