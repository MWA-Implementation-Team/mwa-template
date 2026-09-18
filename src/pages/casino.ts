import { RequestHandler, writePage } from "../http.js";

export const httpCasinoGet: RequestHandler = async ({ res }) => {
    writePage({
        res,
        pageId: 'casino',
        props: {},
    });
};

