import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: [
    "**/tests/**/*.test.ts?(x)",
    "**/__tests__/**/*.test.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)",
  ],
  collectCoverageFrom: [
    "features/**/*.{ts,tsx}",
    "!features/**/*.d.ts",
    "!features/**/index.tsx",
    "!features/**/type.ts",
    "!features/**/interface.ts",
    "!features/**/constant.ts",
  ],
};

export default createJestConfig(customJestConfig);
