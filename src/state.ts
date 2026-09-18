import { DatabaseSync } from 'node:sqlite';

// Global state for the server.

// In dev mode, sourcemaps and source code are returned to client
// Also, a reload watcher starts listening on the client for auto reload
export let isDevMode: boolean = process.argv[2] === '--dev';

export let database = new DatabaseSync('db.sqlite');
