// This is the development script. It starts the server (main.ts)
// and restarts it when any changes are detected, reloading any
// browser tabs that have the site open.

import { spawn, exec as execCallback, ChildProcess } from 'child_process';
import { watch } from 'fs';
import { promisify } from 'util';
import { createServer, ServerResponse } from 'http';
const exec = promisify(execCallback);

const connectedWatchers: ServerResponse[] = [];

const reloadServer = createServer((req, res) => {
    if (req.url !== '/watch') {
        res.writeHead(404);
        res.end();
        return;
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Access-Control-Allow-Origin': '*',
    });

    connectedWatchers.push(res);

    req.on('close', () => {
        const idx = connectedWatchers.indexOf(res);
        res.end();
        if (idx === -1) return; // probably cannot happen
        connectedWatchers.splice(idx, 1);
    });
});

reloadServer.listen(3001);

function broadcastReload() {
    for (const watcher of connectedWatchers) {
        watcher.write('data: refresh\n\n');
    }
}

let tscWatcher: ChildProcess;
let server: ChildProcess;

function startServer() {
    const child = spawn('node', ['./dist/main.js', '--dev'], {
        stdio: ['inherit', 'pipe', 'inherit'],
    });
    server = child;

    child.stdout.pipe(process.stdout);

    let isServerRunning = false;
    let buffer = '';
    child.stdout.on('data', (chunk: Buffer) => {
        if (isServerRunning) return;
        buffer += chunk.toString();
        if (buffer.includes('Server running')) {
            isServerRunning = true;
            buffer = '';

            // now we know the server is available, send reload signals to every receiver
            broadcastReload();
        }
    });
}

function stop() {
    tscWatcher?.kill();
    server?.kill();
    process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

try {
    await exec('npm run build');
} catch {
    // ignore build failure, tsc-watch will report it
}
startServer();

tscWatcher = spawn('npm', ['run', 'tsc-watch'], { stdio: 'inherit' });

let debounceId: NodeJS.Timeout;

watch('dist', { recursive: true }, () => {
    if (debounceId) {
        clearTimeout(debounceId);
    }
    debounceId = setTimeout(async () => {
        console.log('[dev] Restarting...');
        if (server) {
            await new Promise<void>((resolve) => {
                server.once('exit', () => resolve());
                server.kill('SIGTERM');
            });
        }

        startServer();
    }, 100);
});

watch('static', { recursive: true }, () => {
    // since this is a static file, there is no need to reload the server
    broadcastReload();
});
