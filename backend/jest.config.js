module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^uuid$": "<rootDir>/src/__tests__/__mocks__/uuid.js",
  },
  projects: [
    {
      // ✅ UNIT TESTS — no DB connection, everything is mocked
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "node",
      roots: ["<rootDir>/src"],
      testMatch: ["**/__tests__/unit/**/*.test.ts"],
      moduleNameMapper: {
        "^uuid$": "<rootDir>/src/__tests__/__mocks__/uuid.js",
      },
      // ✅ No setupFilesAfterEnv — unit tests never touch MongoDB
    },
    {
      // ✅ INTEGRATION TESTS — connects to real MongoDB
      displayName: "integration",
      preset: "ts-jest",
      testEnvironment: "node",
      roots: ["<rootDir>/src"],
      testMatch: ["**/__tests__/integration/**/*.test.ts"],
      moduleNameMapper: {
        "^uuid$": "<rootDir>/src/__tests__/__mocks__/uuid.js",
      },
      setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"], // ✅ only integration tests connect to DB
    },
  ],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/app.ts",
    "!src/__tests__/**",
  ],
};