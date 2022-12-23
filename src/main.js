// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { playwrightRouter, eventURLs } from './routes-playwright.js';

const startUrls = ['https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&NAME=&CB_COUNTRY=1&FILTERCOUNTRYID=1&CB_WHEN=1&WHEN=future&GENRES=#results'];

const crawler = new PlaywrightCrawler({
    //IP address blocking
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: playwrightRouter,

    //testing
    headless: false,
    maxConcurrency: 1,
    maxRequestsPerCrawl: 5
});

console.log(eventURLs)

await crawler.run(startUrls);
