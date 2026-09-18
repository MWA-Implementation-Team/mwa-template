import { getVisitCount, markVisit } from "../database.js";
import { RequestHandler, writePage } from "../http.js";

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

