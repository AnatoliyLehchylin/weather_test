import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jest-environment-jsdom',
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    testMatch: [
        '**/?(*.)+(spec|test).ts?(x)',
    ],
};

export default config;