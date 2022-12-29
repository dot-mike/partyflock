// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration, CheerioCrawler } from 'crawlee';
import { playwrightRouter } from './routes-playwright.js';
import { cheerioRouter } from './routes-cheerio.js';

export const eventURLs  = []

const startUrls = ['https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&NAME=&CB_COUNTRY=1&FILTERCOUNTRYID=1&CB_WHEN=1&WHEN=future&GENRES=#results'];

const playwrightCrawler = new PlaywrightCrawler({
    //IP address blocking
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: playwrightRouter,

    //testing
   // headless: false,
    maxConcurrency: 1,
    maxRequestsPerCrawl: 5
});

const cheerioCrawler = new CheerioCrawler({
    //IP address blocking
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: cheerioRouter,
    //testing
    maxConcurrency: 1,
});

console.log(eventURLs)

//testing only cheerio
//await playwrightCrawler.run(startUrls);

console.log("Playwright finished")

//commented due to testing of cheerio with artif. input
//console.log([eventURLs[0]])
//await cheerioCrawler.run([eventURLs[0]]);
await cheerioCrawler.run(["https://partyflock.nl/party/440994:Awakenings"]);
//await cheerioCrawler.run(["https://partyflock.nl/party/421036:Army-of-Hardcore"]);

