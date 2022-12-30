// For more information, see https://crawlee.dev/
import { PlaywrightCrawler, ProxyConfiguration, CheerioCrawler } from 'crawlee';
import { playwrightRouter } from './routes-playwright.js';
import { cheerioRouter } from './routes-cheerio.js';
import { Actor } from 'apify';

await Actor.init();

export const eventURLs = []

const startUrl = ['https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&NAME=&CB_COUNTRY=1&FILTERCOUNTRYID=1&CB_WHEN=1&WHEN=future&GENRES=#results'];

const playwrightCrawler = new PlaywrightCrawler({
    
    //avoiding IP address blocking
    proxyConfiguration: await Actor.createProxyConfiguration({
        "useApifyProxy": true,
        "apifyProxyGroups": [
            "USA"
        ]
    }),
    requestHandler: playwrightRouter,
});

const cheerioCrawler = new CheerioCrawler({

    //IP address blocking
    proxyConfiguration: await Actor.createProxyConfiguration({
        "useApifyProxy": true,
        "apifyProxyGroups": [
            "USA"
        ]
    }),

    requestHandler: cheerioRouter,

});


await playwrightCrawler.run(startUrl);

console.log("Playwright finished")

//testing only first and last url for cheerio from start urls collected by playwright
//await cheerioCrawler.run([eventURLs[0], eventURLs[eventURLs.length-1]]);

await cheerioCrawler.run(eventURLs);

await Actor.exit();