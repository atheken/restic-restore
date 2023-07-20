### restic-restore

A simple web app to browse and extract files from `restic` snapshots.

#### Goals:

- Easily add repo configs that can be used to browse/restore files.
- Zero-client installs/downloads (unlike restic-browser)
- Easily self-hosted/containerized following 12 Factor App principles.
- Limited in-browser viewing (if the file is natively recognized by a browser, it will be displayed directly, otherwise, normal download behaviors will apply)
- Deep-linking to snapshots and files (provides a means for System Admins to provide links for restored files in emails)
- The app should require TLS (or a trusted header) when run in production mode.
- A repo's password will be required whenever a user accesses a repo, and will be stored as an server-encrypted http-only+secure cookie for the duration of a browser's session. Secrets are never stored in plain-text on disk.
- TBD: Limited file search capabilities
- TBD: Standalone distributions. This app will be built/distributed via docker containers to start but tools like [pkg](https://www.npmjs.com/package/pkg) may be used in the future to enable more deployment scenarios.

#### Non-goals:

- No repo pruning/management
- No user management
- No deep repo analytics (possibly total size, but generally nothing that restic can't provide in `O(1)` time)
- No mobile-friendly or a dark mode (some effort will be made to make it usable on mobile, but the expected use case of this tool should be infrequent/emergency access)

#### Development:

The repo contains a `.devcontainer` setup that should work well with Visual Studio Code and the Dev Containers extension. You can launch the app in the debugger and view it on [http://localhost:5173](http://localhost:5173).
