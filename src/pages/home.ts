import { getVisitCount, markVisit } from '#src/database.js';
import { writePage } from '#src/http.js';
import { RequestHandler } from '#src/router.js';

export const httpHomeGet: RequestHandler = async ({ res }) => {
    markVisit();
    const visitCount = getVisitCount();

    writePage({
        res,
        pageId: 'home',
        props: {
            visitCount,
        },
    });
};
