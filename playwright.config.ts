import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const pages=process.env.OT_PAGES_TEST==='1';
export default defineConfig({testDir:'tests',fullyParallel:false,workers:1,use:{baseURL:pages?'http://localhost:4175/OT-command-center/':'http://localhost:4173/',headless:true,launchOptions:{executablePath:existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined}},webServer:{command:pages?'npm run preview -- --mode pages --port 4175 --strictPort':'npm run preview -- --port 4173 --strictPort',port:pages?4175:4173,reuseExistingServer:!process.env.CI},reporter:'list'});
