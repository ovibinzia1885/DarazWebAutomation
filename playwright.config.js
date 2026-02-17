// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { workers } from 'node:cluster';
import { report } from 'node:process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 40*1000, 
  },
  // reporter: [
  //   ['html', { outputFolder: 'playwright-report' }],
  //   ['allure-playwright', { outputFolder: 'allure-results' }],
  // ],
  
  use: {
    browserName: 'chromium',
    headless: false,
    // browserName: 'webkit',
   
  },
  workers: 1,









});

module.exports = config;