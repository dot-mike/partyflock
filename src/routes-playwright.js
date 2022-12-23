import { createPlaywrightRouter} from 'crawlee';

export const playwrightRouter = createPlaywrightRouter();

const eventURLs = []
playwrightRouter.addDefaultHandler(async ({ request, page, log, enqueueLinks }) => {

    const title = await page.title();
    log.info(`Processing input URL: ${title}`, { url: request.loadedUrl });

    let eventElements = await page.$$("tbody.hl a meta")

    for (let i = 0; i < eventElements.length; i++) {
        let eventElementHref = await eventElements[i].getAttribute("content")
        eventURLs.push(eventElementHref)
    }

    log.info(`Enqueueing ${eventURLs.length} party URLs`)
    log.info(`Party URLs:${eventURLs}`)

/**
    await enqueueLinks({
        label: "event",
        urls: eventURLs
    });
 */
}
);

export {eventURLs}