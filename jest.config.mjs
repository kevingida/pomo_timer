import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // jsdom uses the "browser" export condition, which resolves preact signals to its ESM build
    "^@preact/signals-core$":
      "<rootDir>/node_modules/@preact/signals-core/dist/signals-core.js",
  },
  testMatch: [
    "**/tests/**/*.test.ts?(x)",
    "**/__tests__/**/*.test.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)",
  ],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "features/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "providers/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!features/**/type.ts",
    "!features/**/interface.ts",
    "!features/theme/data/**",
  ],
  coverageThreshold: {
    global: { statements: 80, branches: 60, functions: 75, lines: 80 },
  },
};

export default createJestConfig(customJestConfig);
