import { getVisitCount, markVisit } from '#src/database.js';
import { writePage } from '#src/pages.js';
import { Hono } from 'hono';

export function registerHomeRoutes(app: Hono) {
    app.get('/', (ctx) => {
        markVisit();
        const visitCount = getVisitCount();

        return writePage(ctx, 'home', { visitCount });
    });
}
