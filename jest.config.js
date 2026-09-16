const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['tests/**/*.test.ts?(x)', '**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: [
    'features/**/*.{ts,tsx}',
    '!features/**/*.d.ts',
    '!features/**/index.tsx',
    '!features/**/type.ts',
    '!features/**/interface.ts',
    '!features/**/constant.ts',
  ],
}

module.exports = createJestConfig(customJestConfig)
