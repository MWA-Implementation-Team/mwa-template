import { getVisitCount, markVisit } from "../database.js";
import { writePage } from "../http.js";
import { RequestHandler } from "../router.js";

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

