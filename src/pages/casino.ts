import { RequestHandler, writePage } from '#src/router.js';

export const httpCasinoGet: RequestHandler = async (ctx) => {
    writePage({
        ctx,
        pageId: 'casino',
        props: {},
    });
};
