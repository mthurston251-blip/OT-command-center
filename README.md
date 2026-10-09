# OT Command Center

A local-first, Chromebook-compatible prototype for school occupational therapy. It starts with **100 fictional students at five fictional schools**. Never enter real student information in this version: its IndexedDB records are not encrypted yet.

## Preview in the cloud workspace

Open the terminal in this repository and run:

```sh
npm ci --cache /workspace/.npm-cache
npm run dev
```

Use your coding environment's port preview for port **5173**. This opens the app in a browser. If your environment does not offer a port preview, download/open the project on a computer with Node.js 22 or newer and run the same commands there. No database server, accounts, or API keys are needed.

## Check the installable, offline version

```sh
npm run test
npm run build
npm run preview
```

The production preview uses port **4173**. Open it through a secure HTTPS preview, or on `localhost` on your own computer. Service workers require HTTPS or localhost. The development server is for editing; the production build is the installable offline version.

Load the production app once while online and allow its service worker to finish caching. In Chrome, choose **Install OT Command Center** from the address bar/menu (or use the app's Install button when offered). You can then reopen it without internet. Installation availability depends on Chrome and the preview host. Test offline by disconnecting and reopening the app. The service worker caches the app files; IndexedDB keeps students, schedules, availability, and logs on that browser/device.

## Using the app

- Dashboard: today's sessions, caseload count, average service progress, and upcoming IEP dates.
- Students: search/filter the caseload and add fictional students with a service requirement.
- Weekly calendar: move between weeks and add individual or same-school group sessions. Remove a session to replace it with a revised time.
- School availability: pick a school, then click a half-hour cell to cycle available → discouraged → unavailable. Availability is a planning guide; it does not enforce or generate a schedule.
- Service progress: see delivered and remaining service for each student's current requirement period.
- Service log: select one or several students and enter actual minutes per student. Hold Ctrl (Chromebook) or Command (Mac) for multiple selection. Delete incorrect entries and record a corrected entry.

Weeks run Monday–Sunday; months, quarters, and years follow the calendar (not the academic year). Session requirements count separate logged visits, not minutes. A group log creates one visit per selected student. Dashboard progress averages each student's percentage for their own current period, so it does not combine minutes and sessions into one total.

## Local storage and next steps

This prototype has no backend, cloud database, external analytics, or external font requests. Data is specific to a browser profile and origin. Switching preview URLs/devices will not transfer it. Clearing site data removes it; there is no backup function yet.

Before using real records, the next phase needs local encryption, encrypted export/import backups, a privacy review, academic-year/service-period settings, and stronger recovery safeguards. `src/storage.ts` is the storage boundary for future encryption and backup adapters. Do not start using real records until those protections are implemented and reviewed. Automatic scheduling is deliberately outside Phase 1.

## Developer checks

```sh
npm test
npm run build
npm run test:e2e
```

The browser suite runs a production server, checks local persistence and group logging, and reloads offline after service-worker activation. The cloud uses its existing system Chromium browser. On other computers, install the test browser once with `npx playwright install chromium`.  Unit calculations are in `src/model.test.ts`.

## GitHub Pages (no installation on a school computer)

A deployment workflow is prepared in `.github/workflows/pages.yml`. It builds the application and publishes the static files; it does not upload browser student records.

After the project is pushed to the repository's `main` branch, open the repository on GitHub and choose **Settings → Pages → Source → GitHub Actions**. The workflow runs on pushes to main and can also be started from **Actions → Publish OT Command Center → Run workflow**. Wait for deployment to succeed; then Pages displays the actual website address. The expected address is `https://mthurston251-blip.github.io/OT-command-center/`. This is not live until deployment succeeds. Availability for private repositories depends on the GitHub plan; a published Pages site may be publicly accessible. Keep only fictional data in the prototype.

The Pages build uses `npm run build:pages` so asset URLs, manifest scope, and the service worker work under the repository path. To validate that path locally, run `npm run build:pages` then `OT_PAGES_TEST=1 npm run test:e2e`. Run `npm run build` afterward to restore the ordinary local preview build.
