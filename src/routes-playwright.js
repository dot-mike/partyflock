import { createPlaywrightRouter } from 'crawlee';
import { eventURLs } from "./main.js"

const playwrightRouter = createPlaywrightRouter();

playwrightRouter.addDefaultHandler(async ({ request, page, log }) => {

    const title = await page.title();
    log.info(`Processing input URL: ${title}`, { url: request.loadedUrl });

    let eventElements = await page.$$("tbody.hl a meta")

    for (let i = 0; i < eventElements.length; i++) {
        let eventElementHref = await eventElements[i].getAttribute("content")
        eventURLs.push(eventElementHref)
    }

    log.info(`Enqueueing ${eventURLs.length} party URLs`)
}
);

export { playwrightRouter, eventURLs }