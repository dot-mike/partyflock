import { PlaywrightCrawler, CheerioCrawler } from "crawlee";
import { playwrightRouter } from "./routes-playwright.js";
import { cheerioRouter } from "./routes-cheerio.js";
import { Actor } from "apify";
import { countries } from "../utilities/countries.js";

await Actor.init();

export const eventURLs = [];
const { inputCountry, year } = await Actor.getInput();

const countryCode = countries[`${inputCountry}`];

const startUrl = [
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=1&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=2&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=2&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=3&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=3&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=4&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=4&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=5&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=5&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=6&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=6&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=7&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=7&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=8&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=8&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=9&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=9&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=10&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=10&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=11&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=11&START_YEAR=${year}&STOP_DAY=1&STOP_MONTH=12&STOP_YEAR=${year}#results`,
  `https://partyflock.nl/agenda/search?enc=%F0%9F%A5%B0&CB_COUNTRY=${countryCode}&FILTERCOUNTRYID=${countryCode}&CB_WHEN=1&WHEN=date&START_DAY=1&START_MONTH=12&START_YEAR=${year}&STOP_DAY=31&STOP_MONTH=12&STOP_YEAR=${year}#results`,
];

const playwrightCrawler = new PlaywrightCrawler({
  headless: true,
  //avoiding IP address blocking
  proxyConfiguration: await Actor.createProxyConfiguration(),
  requestHandler: playwrightRouter,
});

const cheerioCrawler = new CheerioCrawler({
  //IP address blocking
  proxyConfiguration: await Actor.createProxyConfiguration(),
  preNavigationHooks: [
    async ({ request }) => {
      request.headers["cookie"] = "FLOCK_LANGUAGE=0";
    },
  ],

  requestHandler: cheerioRouter,

  maxRequestRetries: 10,
});

await playwrightCrawler.run(startUrl);

console.log("Playwright finished");

//test only the first and last url for cheerio from start urls collected by playwright
//await cheerioCrawler.run([eventURLs[0], eventURLs[eventURLs.length - 1]]);

await cheerioCrawler.run(eventURLs);

await Actor.exit();
