import { writePage } from '#src/http.js';
import { RequestHandler } from '#src/router.js';

export const httpCasinoGet: RequestHandler = async ({ res }) => {
    writePage({
        res,
        pageId: 'casino',
        props: {},
    });
};
