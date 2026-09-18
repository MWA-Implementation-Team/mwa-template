import { writePage } from "../http.js";
import { RequestHandler } from "../router.js";

export const httpCasinoGet: RequestHandler = async ({ res }) => {
    writePage({
        res,
        pageId: 'casino',
        props: {},
    });
};

