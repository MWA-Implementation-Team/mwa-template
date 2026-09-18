import { getVisitCount, markVisit } from '#src/database.js';
import { RequestHandler, writePage } from '#src/router.js';

export const httpHomeGet: RequestHandler = async (ctx) => {
    markVisit();
    const visitCount = getVisitCount();

    writePage({
        ctx,
        pageId: 'home',
        props: {
            visitCount,
        },
    });
};
